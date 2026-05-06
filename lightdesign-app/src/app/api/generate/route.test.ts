/* @vitest-environment node */

import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { buildApimartGenerationPayload, POST } from '@/app/api/generate/route';

function buildFormRequest(formData: FormData) {
  return new NextRequest('http://localhost/api/generate', {
    method: 'POST',
    body: formData,
  });
}

describe('/api/generate POST', () => {
  beforeEach(() => {
    vi.stubEnv('APIMART_API_KEY', '');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  test('returns 400 when image is missing', async () => {
    const formData = new FormData();
    formData.set('selling1', '限时五折');
    formData.set('selling2', '买二送一');
    formData.set('platform', 'amazon');
    formData.set('style', 'clean');

    const response = await POST(buildFormRequest(formData));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: '请上传商品图片' });
  });

  test('returns 200 with mocked image payload when image is provided', async () => {
    const formData = new FormData();
    formData.set('selling1', '限时五折');
    formData.set('selling2', '买二送一');
    formData.set('platform', 'taobao');
    formData.set('style', 'promo');
    formData.set('image', new File([new Uint8Array([137, 80, 78, 71])], 'product.png', { type: 'image/png' }));

    const response = await POST(buildFormRequest(formData));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.imageUrl).toContain('data:image/svg+xml');
    expect(body.platform).toBe('taobao');
    expect(body.style).toBe('promo');
    expect(body.prompt).toContain('电商产品主图设计');
  }, 10000);

  test('includes image_urls in APIMART payload when source image exists', () => {
    const payload = buildApimartGenerationPayload(
      {
        selling1: '限时五折',
        selling2: '买二送一',
        platform: 'amazon',
        style: 'clean',
      },
      { dataUrl: 'data:image/png;base64,AAA=' },
    );

    expect(payload).toMatchObject({
      model: 'gpt-image-2',
      n: 1,
      size: '1:1',
      image_urls: ['data:image/png;base64,AAA='],
    });
  });
});
