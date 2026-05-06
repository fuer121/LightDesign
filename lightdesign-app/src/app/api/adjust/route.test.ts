/* @vitest-environment node */

import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { POST } from '@/app/api/adjust/route';
import type { AdjustInput } from '@/lib/types';

function buildJsonRequest(body: AdjustInput) {
  return new NextRequest('http://localhost/api/adjust', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const baseInput = {
  selling1: '限时五折',
  selling2: '买二送一',
  platform: 'general',
  style: 'clean',
} as const;

describe('/api/adjust POST', () => {
  beforeEach(() => {
    vi.stubEnv('APIMART_API_KEY', '');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  test('returns 400 when instruction is empty', async () => {
    const response = await POST(buildJsonRequest({
      imageUrl: 'https://example.com/original.png',
      instruction: '   ',
      history: [],
      baseInput,
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: '请输入调整指令' });
  });

  test('returns 200 with mocked adjusted image when instruction is provided', async () => {
    vi.useFakeTimers();

    const responsePromise = POST(buildJsonRequest({
      imageUrl: 'https://example.com/original.png',
      instruction: '把背景换成蓝色',
      history: [{ role: 'user', content: '文字放大一些' }],
      baseInput,
    }));

    await vi.runAllTimersAsync();
    const response = await responsePromise;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.imageUrl).toContain('data:image/svg+xml');
    expect(body.platform).toBe('general');
    expect(body.style).toBe('clean');
    expect(body.instruction).toBe('把背景换成蓝色');
    expect(body.versionId).toMatch(/^v\d+$/);
    expect(body.prompt).toContain('累计2次修改');
  });
});
