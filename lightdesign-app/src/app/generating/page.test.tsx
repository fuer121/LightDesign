import { render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import GeneratingPage from '@/app/generating/page';
import type { GenerationInput, GenerationResult } from '@/lib/types';

const push = vi.fn();
const replace = vi.fn();
const refresh = vi.fn();
const setResult = vi.fn();

const uploadedFile = new File([new Uint8Array([137, 80, 78, 71])], 'product.png', { type: 'image/png' });

const input: GenerationInput = {
  selling1: '限时五折',
  selling2: '全国包邮',
  platform: 'general',
  style: 'clean',
};

const generated: GenerationResult = {
  imageUrl: 'data:image/svg+xml;base64,PHN2Zy8+',
  platform: 'general',
  style: 'clean',
  generatedAt: '2026-05-05T10:00:00.000Z',
  prompt: 'mock prompt',
};

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace, refresh }),
}));

vi.mock('@/components/GenContext', () => ({
  useGen: () => ({
    input,
    uploadedFile,
    previewUrl: 'blob:preview',
    setResult,
  }),
}));

describe('GeneratingPage', () => {
  beforeEach(() => {
    push.mockReset();
    replace.mockReset();
    refresh.mockReset();
    setResult.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('submits uploaded image and stores generated result', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => generated,
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<GeneratingPage />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/generate', expect.objectContaining({ method: 'POST' }));
    });

    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get('selling1')).toBe('限时五折');
    expect(body.get('selling2')).toBe('全国包邮');
    expect(body.get('platform')).toBe('general');
    expect(body.get('style')).toBe('clean');
    expect(body.get('image')).toBe(uploadedFile);

    await waitFor(() => {
      expect(setResult).toHaveBeenCalledWith(generated);
    });
  });
});
