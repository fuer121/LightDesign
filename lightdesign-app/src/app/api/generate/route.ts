import { NextRequest, NextResponse } from 'next/server';
import { GenerationInput, PLATFORM_SPECS, STYLE_LABELS } from '@/lib/types';

// 构建给 AI 的 prompt
function buildPrompt(input: GenerationInput): string {
  const platformSpec = PLATFORM_SPECS[input.platform];
  const styleLabel = STYLE_LABELS[input.style];

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

// Mock 生成（无 API key 时使用）
function mockGenerate(input: GenerationInput): { imageUrl: string; prompt: string } {
  const spec = PLATFORM_SPECS[input.platform];
  const sellingLines = [input.selling1, input.selling2];
  if (input.selling3) sellingLines.push(input.selling3);

  // 用 SVG 生成一个带文案的占位图
  const bgColors: Record<string, string> = {
    clean: '#f8f9fa',
    lifestyle: '#e8f5e9',
    promo: '#fff3e0',
  };

  const bg = bgColors[input.style] || '#f0f0f5';

  const textLines = sellingLines
    .map((t, i) => `<text x="${spec.width / 2}" y="${spec.height * 0.72 + i * 45}" text-anchor="middle" font-size="32" font-weight="bold" fill="#1d1d1f" font-family="Noto Sans SC, sans-serif">${t}</text>`)
    .join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}">
  <rect width="${spec.width}" height="${spec.height}" fill="${bg}"/>
  <rect x="${spec.width * 0.1}" y="${spec.height * 0.08}" width="${spec.width * 0.8}" height="${spec.height * 0.55}" rx="16" fill="#fff" opacity="0.9"/>
  <text x="${spec.width / 2}" y="${spec.height * 0.35}" text-anchor="middle" font-size="48" fill="#d97706" font-family="sans-serif">[商品]</text>
  <text x="${spec.width / 2}" y="${spec.height * 0.45}" text-anchor="middle" font-size="20" fill="#86868b" font-family="sans-serif">商品主图示意</text>
  ${textLines}
  <rect x="${spec.width * 0.72}" y="${spec.height * 0.06}" width="${spec.width * 0.2}" height="40" rx="6" fill="#dc2626"/>
  <text x="${spec.width * 0.82}" y="${spec.height * 0.06 + 27}" text-anchor="middle" font-size="16" font-weight="bold" fill="#fff" font-family="Noto Sans SC, sans-serif">限时特惠</text>
</svg>`;

  const b64 = Buffer.from(svg).toString('base64');
  return {
    imageUrl: `data:image/svg+xml;base64,${b64}`,
    prompt: buildPrompt(input),
  };
}

// 实际 DALL-E 调用（需设置环境变量 OPENAI_API_KEY）
async function dalleGenerate(input: GenerationInput): Promise<{ imageUrl: string; prompt: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY 未配置');

  const prompt = buildPrompt(input);
  const size = getDalleSize(input.platform);

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size,
      quality: 'standard',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DALL-E API 错误: ${res.status} ${err}`);
  }

  const data = await res.json();
  return { imageUrl: data.data[0].url, prompt };
}

function getDalleSize(platform: string): '1024x1024' | '1792x1024' | '1024x1792' {
  // DALL-E 3 支持的尺寸有限，选最接近的
  if (platform === 'amazon') return '1024x1024';
  return '1024x1024';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const input: GenerationInput = {
      selling1: (formData.get('selling1') as string) || '',
      selling2: (formData.get('selling2') as string) || '',
      selling3: (formData.get('selling3') as string) || undefined,
      platform: (formData.get('platform') as GenerationInput['platform']) || 'general',
      style: (formData.get('style') as GenerationInput['style']) || 'clean',
    };

    // 校验
    if (!input.selling1.trim() || !input.selling2.trim()) {
      return NextResponse.json({ error: '卖点 1 和卖点 2 为必填项' }, { status: 400 });
    }

    let result: { imageUrl: string; prompt: string };

    // 尝试 DALL-E，失败回退到 mock
    if (process.env.OPENAI_API_KEY) {
      try {
        result = await dalleGenerate(input);
      } catch (e) {
        console.error('DALL-E 调用失败，回退到 mock:', e);
        result = mockGenerate(input);
      }
    } else {
      // 无 API key 时延迟模拟真实生成耗时
      await new Promise(r => setTimeout(r, 2000));
      result = mockGenerate(input);
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
