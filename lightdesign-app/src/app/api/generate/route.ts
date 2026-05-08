import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { spawnSync } from 'child_process';
import { PLATFORM_SPECS } from '@/lib/types';
import type { GenerationInput } from '@/lib/types';

const APIMART_BASE = 'https://api.apimart.ai/v1/';
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

interface UploadedSourceImage {
  fileName: string;
  mediaType: string;
  dataUrl: string;
}

interface ApimartSubmitResponse {
  code?: number;
  data?: Array<{ task_id?: string }>;
}

interface ApimartTaskResult {
  images?: Array<{ url?: string[] }>;
}

interface ApimartTaskData {
  status?: string;
  result?: ApimartTaskResult;
  error?: { message?: string };
}

interface ApimartTaskResponse {
  code?: number;
  data?: ApimartTaskData;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildApimartUrl(path: string): URL {
  return new URL(path.replace(/^\/+/, ''), APIMART_BASE);
}

async function readUploadedImage(entry: FormDataEntryValue | null): Promise<UploadedSourceImage | null> {
  if (!entry) return null;
  if (typeof entry === 'string') {
    throw new Error('上传文件格式不正确');
  }

  if (!entry.type.match(/^image\/(jpeg|png)$/)) {
    throw new Error('仅支持 JPG 和 PNG 格式');
  }

  const buffer = Buffer.from(await entry.arrayBuffer());
  if (buffer.byteLength > MAX_UPLOAD_SIZE) {
    throw new Error('文件大小不能超过 10MB');
  }

  return {
    fileName: entry.name,
    mediaType: entry.type,
    dataUrl: `data:${entry.type};base64,${buffer.toString('base64')}`,
  };
}

function extractTaskId(body: unknown): string {
  if (!isRecord(body)) {
    throw new Error('GPT Image 2 提交失败: 返回格式异常');
  }

  const submitBody = body as ApimartSubmitResponse;
  if (submitBody.code !== 200) {
    throw new Error(`GPT Image 2 提交失败: ${JSON.stringify(body)}`);
  }

  const taskId = submitBody.data?.[0]?.task_id;
  if (!taskId) {
    throw new Error('未获取到 task_id');
  }

  return taskId;
}

function extractImageUrl(body: unknown): string {
  if (!isRecord(body)) {
    throw new Error('任务查询异常: 返回格式异常');
  }

  const taskBody = body as ApimartTaskResponse;
  if (taskBody.code !== 200 || !taskBody.data) {
    throw new Error(`任务查询异常: ${JSON.stringify(body)}`);
  }

  if (taskBody.data.status === 'failed') {
    throw new Error(taskBody.data.error?.message || '图像生成任务失败');
  }

  if (taskBody.data.status !== 'completed') {
    return '';
  }

  const imageUrl = taskBody.data.result?.images?.[0]?.url?.[0];
  if (!imageUrl) {
    throw new Error('任务完成但未返回图片 URL');
  }

  return imageUrl;
}

// 通用 HTTPS 请求（绕过 undici TLS 兼容问题）
function httpsRequest(method: string, path: string, apiKey: string, body?: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined;
    const url = buildApimartUrl(path);

    const req = https.request({
      hostname: url.hostname,
      servername: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method,
      family: 4,
      headers: {
        'Host': url.hostname,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'LightDesign/1.0',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch {
          // 非 JSON 响应（如 CDN 路由到网站首页），拒绝
          reject(new Error(`API 返回非 JSON 响应: ${raw.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('请求超时')); });

    if (data) req.write(data);
    req.end();
  });
}

// curl 回退 — macOS Node.js 有时 TLS/CDN 路由异常
function curlRequest(method: string, path: string, apiKey: string, body?: unknown): unknown {
  const url = buildApimartUrl(path);
  const data = body ? JSON.stringify(body) : undefined;

  const args = [
    '-sS', '-X', method,
    '-H', `Authorization: Bearer ${apiKey}`,
    '-H', 'Content-Type: application/json',
    '-H', 'Accept: application/json',
    '--connect-timeout', '15',
    '--max-time', '45',
  ];

  if (data) {
    args.push('--data-binary', '@-');
  }

  args.push(url.toString());

  const result = spawnSync('curl', args, {
    encoding: 'utf-8',
    input: data,
    timeout: 35000,
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`curl 请求失败: ${result.stderr.slice(0, 200)}`);
  }

  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`curl 返回非 JSON 响应: ${result.stdout.slice(0, 200)}`);
  }
}

// 智能请求 — 先 https.request，失败回退 curl
async function smartRequest(method: string, path: string, apiKey: string, body?: unknown): Promise<unknown> {
  try {
    return await httpsRequest(method, path, apiKey, body);
  } catch (e) {
    const message = e instanceof Error ? e.message : '未知错误';
    console.warn(`https.request 失败，尝试 curl 回退: ${message}`);
    return curlRequest(method, path, apiKey, body);
  }
}

// 异步轮询 GPT Image 2 任务直到完成
async function pollTask(taskId: string, apiKey: string, maxWaitMs = 90000): Promise<string> {
  const startTime = Date.now();
  // 首次等待 10 秒让任务开始处理
  await new Promise(r => setTimeout(r, 10000));

  while (Date.now() - startTime < maxWaitMs) {
    const body = await smartRequest('GET', `/tasks/${taskId}`, apiKey);
    const imageUrl = extractImageUrl(body);

    if (imageUrl) {
      return imageUrl;
    }

    // 仍在处理中，等 3 秒再查
    await new Promise(r => setTimeout(r, 3000));
  }

  throw new Error('图像生成超时，请稍后重试');
}

// 构建 prompt
function buildPrompt(input: GenerationInput): string {
  const platformSpec = PLATFORM_SPECS[input.platform];

  const sellingLines = [input.selling1, input.selling2];
  if (input.selling3) sellingLines.push(input.selling3);

  const sellingText = sellingLines.map((s, i) => `卖点${i + 1}: ${s}`).join('\n');

  const stylePrompts: Record<string, string> = {
    clean: '纯白底棚拍风格，洁净高级，无多余装饰',
    lifestyle: '生活场景使用展示，自然光线，柔和氛围',
    promo: '电商促销风格，醒目配色，折扣标签突出',
  };

  return `电商产品主图设计，${stylePrompts[input.style] || input.style}。
尺寸 ${platformSpec.width}x${platformSpec.height}px，${platformSpec.label}平台标准。
文本需叠加在图片上:
${sellingText}

要求：
- 商品为画面主体，居中呈现，品质感强
- 文字清晰可读，与背景有明显对比
- 整体构图符合${platformSpec.label}平台主图规范
- 不得出现未授权品牌标识或虚假宣传内容`;
}

// 平台 → API 尺寸映射
function platformToSize(platform: string): { size: string; resolution: string } {
  const resolution = process.env.APIMART_RESOLUTION || '1k';

  switch (platform) {
    case 'amazon':
      return { size: '1:1', resolution: resolution === '1k' ? '1k' : '2k' };
    case 'taobao':
      return { size: '1:1', resolution: '1k' };
    case 'shopee':
      return { size: '1:1', resolution: '1k' };
    case 'general':
      return { size: '1:1', resolution: resolution === '1k' ? '1k' : '2k' };
    default:
      return { size: '1:1', resolution: '1k' };
  }
}

export function buildApimartGenerationPayload(
  input: GenerationInput,
  uploadedSourceImage: { dataUrl: string } | null,
): Record<string, unknown> {
  const prompt = buildPrompt(input);
  const { size, resolution } = platformToSize(input.platform);

  const payload: Record<string, unknown> = {
    model: 'gpt-image-2',
    prompt,
    n: 1,
    size,
    resolution,
  };

  if (uploadedSourceImage?.dataUrl) {
    payload.image_urls = [uploadedSourceImage.dataUrl];
  }

  return payload;
}

// GPT Image 2 生成（提交 + 轮询）
async function gptImage2Generate(
  input: GenerationInput,
  uploadedSourceImage: UploadedSourceImage | null,
): Promise<{ imageUrl: string; prompt: string }> {
  const apiKey = process.env.APIMART_API_KEY;
  const trimmedApiKey = apiKey?.trim();
  if (!trimmedApiKey) throw new Error('APIMART_API_KEY 未配置');

  // 1. 提交生成任务
  const submitBody = await smartRequest(
    'POST',
    '/images/generations',
    trimmedApiKey,
    buildApimartGenerationPayload(input, uploadedSourceImage),
  );

  const taskId = extractTaskId(submitBody);

  // 2. 轮询直到完成
  const imageUrl = await pollTask(taskId, trimmedApiKey);

  return { imageUrl, prompt: buildPrompt(input) };
}

// Mock 回退（无 API key 时使用）
function mockGenerate(
  input: GenerationInput,
  uploadedSourceImage: UploadedSourceImage | null,
): { imageUrl: string; prompt: string } {
  const spec = PLATFORM_SPECS[input.platform];
  const sellingLines = [input.selling1, input.selling2];
  if (input.selling3) sellingLines.push(input.selling3);

  const bgColors: Record<string, string> = {
    clean: '#f8f9fa',
    lifestyle: '#e8f5e9',
    promo: '#fff3e0',
  };

  const bg = bgColors[input.style] || '#f0f0f5';

  const previewMarkup = uploadedSourceImage
    ? `<image href="${escapeXml(uploadedSourceImage.dataUrl)}" x="${spec.width * 0.16}" y="${spec.height * 0.12}" width="${spec.width * 0.68}" height="${spec.height * 0.48}" preserveAspectRatio="xMidYMid slice" clip-path="url(#product-frame)"/>`
    : `<text x="${spec.width / 2}" y="${spec.height * 0.35}" text-anchor="middle" font-size="48" fill="#d97706" font-family="sans-serif">[商品]</text>`;

  const textLines = sellingLines
    .map((t, i) => `<text x="${spec.width / 2}" y="${spec.height * 0.72 + i * 45}" text-anchor="middle" font-size="32" font-weight="bold" fill="#1d1d1f" font-family="Noto Sans SC, sans-serif">${escapeXml(t)}</text>`)
    .join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}">
  <defs>
    <clipPath id="product-frame">
      <rect x="${spec.width * 0.16}" y="${spec.height * 0.12}" width="${spec.width * 0.68}" height="${spec.height * 0.48}" rx="16"/>
    </clipPath>
  </defs>
  <rect width="${spec.width}" height="${spec.height}" fill="${bg}"/>
  <rect x="${spec.width * 0.1}" y="${spec.height * 0.08}" width="${spec.width * 0.8}" height="${spec.height * 0.55}" rx="16" fill="#fff" opacity="0.9"/>
  ${previewMarkup}
  <text x="${spec.width / 2}" y="${spec.height * 0.45}" text-anchor="middle" font-size="20" fill="#86868b" font-family="sans-serif">商品主图示意 (Mock)</text>
  ${textLines}
  <rect x="${spec.width * 0.72}" y="${spec.height * 0.06}" width="${spec.width * 0.2}" height="40" rx="6" fill="#dc2626"/>
  <text x="${spec.width * 0.82}" y="${spec.height * 0.06 + 27}" text-anchor="middle" font-size="16" font-weight="bold" fill="#fff" font-family="Noto Sans SC, sans-serif">限时特惠</text>
</svg>`;

  return {
    imageUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    prompt: buildPrompt(input),
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const uploadedSourceImage = await readUploadedImage(formData.get('image'));

    const input: GenerationInput = {
      selling1: (formData.get('selling1') as string) || '',
      selling2: (formData.get('selling2') as string) || '',
      selling3: (formData.get('selling3') as string) || undefined,
      platform: (formData.get('platform') as GenerationInput['platform']) || 'general',
      style: (formData.get('style') as GenerationInput['style']) || 'clean',
    };

    if (!input.selling1.trim() || !input.selling2.trim()) {
      return NextResponse.json({ error: '卖点 1 和卖点 2 为必填项' }, { status: 400 });
    }
    if (!uploadedSourceImage) {
      return NextResponse.json({ error: '请上传商品图片' }, { status: 400 });
    }

    let result: { imageUrl: string; prompt: string };

    if (process.env.APIMART_API_KEY) {
      try {
        result = await gptImage2Generate(input, uploadedSourceImage);
      } catch (e) {
        const message = e instanceof Error ? e.message : '未知错误';
        console.error(`GPT Image 2 调用失败，回退 mock: ${message}`);
        result = mockGenerate(input, uploadedSourceImage);
      }
    } else {
      await new Promise(r => setTimeout(r, 2000));
      result = mockGenerate(input, uploadedSourceImage);
    }

    return NextResponse.json({
      imageUrl: result.imageUrl,
      prompt: result.prompt,
      platform: input.platform,
      style: input.style,
      generatedAt: new Date().toISOString(),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '未知错误';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
