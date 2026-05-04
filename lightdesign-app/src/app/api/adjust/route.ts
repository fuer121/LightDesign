import { NextRequest, NextResponse } from 'next/server';
import { AdjustInput, AdjustResult, GenerationInput, PLATFORM_SPECS, STYLE_LABELS } from '@/lib/types';

function buildBasePrompt(input: GenerationInput): string {
  const spec = PLATFORM_SPECS[input.platform];
  const sellingLines = [input.selling1, input.selling2];
  if (input.selling3) sellingLines.push(input.selling3);
  const text = sellingLines.map((s, i) => `卖点${i + 1}: ${s}`).join('，');

  const styleDesc: Record<string, string> = {
    clean: '纯白底棚拍风格，洁净高级，无多余装饰，商品居于画面中心',
    lifestyle: '生活场景使用展示，自然光线，柔和氛围，商品融入真实使用环境',
    promo: '电商促销风格，醒目配色，红色/橙色折扣标签突出，节日大促氛围',
  };

  return `一张${spec.width}x${spec.height}px的电商产品主图，${styleDesc[input.style] || input.style}。画面需包含文案: ${text}。要求: 商品主体清晰居中、文字可读醒目、构图符合${spec.label}平台主图规范、无未授权品牌标识。`;
}

function interpretInstruction(instruction: string): string {
  // 把自然语言指令转换为 prompt 修改片段
  // 生产环境可以调 GPT-4o-mini 做更精准的 prompt 改写
  const lower = instruction.toLowerCase();

  if (lower.includes('背景') || lower.includes('底色')) {
    if (lower.includes('蓝') || lower.includes('blue')) return '背景改为淡蓝色渐变';
    if (lower.includes('黑') || lower.includes('dark') || lower.includes('深色')) return '背景改为深色/黑色调';
    if (lower.includes('粉') || lower.includes('pink')) return '背景改为柔和的粉色';
    if (lower.includes('绿') || lower.includes('green')) return '背景改为清新绿色调';
    if (lower.includes('渐变')) return '背景改为时尚渐变色';
    return '调整背景颜色，使其更突出商品主体';
  }

  if (lower.includes('文字') || lower.includes('字号') || lower.includes('字体') || lower.includes('大小')) {
    if (lower.includes('大')) return '将卖点文字放大，占画面更显著位置';
    if (lower.includes('小')) return '将卖点文字缩小，更精致低调';
    if (lower.includes('红') || lower.includes('红色')) return '将卖点文字改为红色';
    return '调整卖点文字样式，使其更加醒目';
  }

  if (lower.includes('商品') || lower.includes('产品') || lower.includes('主体')) {
    if (lower.includes('大')) return '将商品主体放大，更突出';
    if (lower.includes('小')) return '将商品主体缩小，留出更多空间';
    if (lower.includes('左') || lower.includes('left')) return '将商品主体向左移动';
    if (lower.includes('右') || lower.includes('right')) return '将商品主体向右移动';
    return '调整商品主体位置和大小';
  }

  if (lower.includes('标签') || lower.includes('徽章') || lower.includes('badge')) {
    if (lower.includes('去')) return '移除促销标签';
    return '添加醒目的促销标签';
  }

  if (lower.includes('对比') || lower.includes('contrast')) return '增强画面色彩对比度';
  if (lower.includes('亮') || lower.includes('bright')) return '整体提亮画面，增加亮度';
  if (lower.includes('暗') || lower.includes('暗调')) return '画面调暗，呈现高级暗调效果';

  if (lower.includes('阴影') || lower.includes('shadow')) return '为商品添加柔和投影效果';
  if (lower.includes('光') || lower.includes('lighting')) return '增强商品光照效果，呈现更立体质感';
  if (lower.includes('简约') || lower.includes('简单') || lower.includes('简洁')) return '简化画面，去除多余元素，极简风格';
  if (lower.includes('热闹') || lower.includes('丰富')) return '增加视觉丰富度，添加促销元素和装饰';

  // 默认：直接把指令附加到 prompt
  return `根据要求调整: ${instruction}`;
}

function buildUpdatedPrompt(baseInput: GenerationInput, history: { role: string; content: string }[], newInstruction: string): string {
  const base = buildBasePrompt(baseInput);

  // 从历史中提取所有用户调整指令
  const adjustmentParts: string[] = [];
  for (const msg of history) {
    if (msg.role === 'user') {
      adjustmentParts.push(interpretInstruction(msg.content));
    }
  }
  adjustmentParts.push(interpretInstruction(newInstruction));

  // 去重
  const unique = [...new Set(adjustmentParts)];

  return `${base}

【已应用的调整】（累计${unique.length}次修改）：
${unique.map((a, i) => `${i + 1}. ${a}`).join('\n')}

请重新生成产品主图，综合所有上述要求。保持商品主体一致性，仅调整指定的方面。`;
}

// Mock 生成（无 API key 时）
function mockGenerate(input: GenerationInput, version: number): { imageUrl: string; prompt: string } {
  const spec = PLATFORM_SPECS[input.platform];
  const sellingLines = [input.selling1, input.selling2];
  if (input.selling3) sellingLines.push(input.selling3);

  const bgColors = ['#f8f9fa', '#e3f2fd', '#fce4ec', '#e8f5e9', '#fff3e0', '#f3e5f5', '#e0f7fa'];
  const bg = bgColors[version % bgColors.length];

  const textLines = sellingLines
    .map((t, i) => `<text x="${spec.width / 2}" y="${spec.height * 0.72 + i * 48}" text-anchor="middle" font-size="${32 + version * 2}" font-weight="bold" fill="#1d1d1f" font-family="Noto Sans SC, sans-serif">${t}</text>`)
    .join('\n');

  const dots = version > 0
    ? Array.from({ length: Math.min(version, 6) }, (_, i) =>
        `<circle cx="${spec.width * (0.15 + i * 0.14)}" cy="${spec.height * 0.1}" r="6" fill="#d97706" opacity="0.6"/>`
      ).join('\n')
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}">
  <rect width="${spec.width}" height="${spec.height}" fill="${bg}"/>
  <rect x="${spec.width * 0.1}" y="${spec.height * 0.08}" width="${spec.width * 0.8}" height="${spec.height * 0.55}" rx="16" fill="#fff" opacity="0.85"/>
  <text x="${spec.width / 2}" y="${spec.height * 0.35}" text-anchor="middle" font-size="48" fill="#d97706" font-family="sans-serif">[商品]</text>
  <text x="${spec.width / 2}" y="${spec.height * 0.45}" text-anchor="middle" font-size="20" fill="#86868b" font-family="sans-serif">商品主图 v${version + 1}</text>
  ${textLines}
  ${dots}
  <rect x="${spec.width * 0.72}" y="${spec.height * 0.06}" width="${spec.width * 0.2}" height="42" rx="8" fill="#dc2626"/>
  <text x="${spec.width * 0.82}" y="${spec.height * 0.06 + 28}" text-anchor="middle" font-size="16" font-weight="bold" fill="#fff" font-family="Noto Sans SC, sans-serif">限时特惠</text>
</svg>`;

  const b64 = Buffer.from(svg).toString('base64');
  return {
    imageUrl: `data:image/svg+xml;base64,${b64}`,
    prompt: buildBasePrompt(input),
  };
}

async function dalleGenerate(prompt: string, platform: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY 未配置');

  const size = '1024x1024'; // DALL-E 3 固定尺寸，前端可缩放

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size, quality: 'standard' }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DALL-E API 错误: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.data[0].url;
}

export async function POST(request: NextRequest) {
  try {
    const body: AdjustInput = await request.json();

    if (!body.instruction.trim()) {
      return NextResponse.json({ error: '请输入调整指令' }, { status: 400 });
    }

    const updatedPrompt = buildUpdatedPrompt(body.baseInput, body.history, body.instruction);
    const versionId = `v${Date.now()}`;

    let imageUrl: string;

    if (process.env.OPENAI_API_KEY) {
      try {
        imageUrl = await dalleGenerate(updatedPrompt, body.baseInput.platform);
      } catch (e) {
        console.error('DALL-E 调用失败，回退 mock:', e);
        const mock = mockGenerate(body.baseInput, body.history.filter(m => m.role === 'user').length);
        imageUrl = mock.imageUrl;
      }
    } else {
      await new Promise(r => setTimeout(r, 1800));
      const mock = mockGenerate(body.baseInput, body.history.filter(m => m.role === 'user').length + 1);
      imageUrl = mock.imageUrl;
    }

    const result: AdjustResult = {
      imageUrl,
      platform: body.baseInput.platform,
      style: body.baseInput.style,
      generatedAt: new Date().toISOString(),
      prompt: updatedPrompt,
      instruction: body.instruction,
      versionId,
    };

    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '未知错误';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
