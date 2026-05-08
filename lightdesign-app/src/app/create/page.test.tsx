import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import CreatePage from '@/app/create/page';

const push = vi.fn();
const setInput = vi.fn();
const setUploadedFile = vi.fn();
const setPreviewUrl = vi.fn();

let previewUrl: string | null = null;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('@/components/GenContext', () => ({
  useGen: () => ({
    setInput,
    setUploadedFile,
    setPreviewUrl,
    previewUrl,
  }),
}));

type MockImageOptions = {
  width: number;
  height: number;
  fail?: boolean;
};

function mockImage({ width, height, fail = false }: MockImageOptions) {
  class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    naturalWidth = width;
    naturalHeight = height;
    width = width;
    height = height;

    set src(_value: string) {
      queueMicrotask(() => {
        if (fail) {
          this.onerror?.();
          return;
        }
        this.onload?.();
      });
    }
  }

  vi.stubGlobal('Image', MockImage);
}

function mockCanvas() {
  const drawImage = vi.fn();
  const toBlob = vi.fn((callback: BlobCallback, type?: string) => {
    callback(new Blob(['compressed image'], { type }));
  });
  const originalCreateElement = document.createElement.bind(document);

  vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
    if (tagName === 'canvas') {
      return {
        width: 0,
        height: 0,
        getContext: vi.fn(() => ({ drawImage })),
        toBlob,
      } as unknown as HTMLCanvasElement;
    }

    return originalCreateElement(tagName, options);
  });

  return { drawImage, toBlob };
}

function upload(container: HTMLElement, file: File) {
  const input = container.querySelector('input[type="file"]');
  if (!input) throw new Error('upload input not found');

  fireEvent.change(input, { target: { files: [file] } });
}

describe('CreatePage image upload preparation', () => {
  beforeEach(() => {
    push.mockReset();
    setInput.mockReset();
    setUploadedFile.mockReset();
    setPreviewUrl.mockReset();
    previewUrl = null;
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn((file: File) => `blob:${file.name}:${file.size}`),
      revokeObjectURL: vi.fn(),
    });
  });

  test('大图触发 canvas 降采样并使用处理后的 File', async () => {
    mockImage({ width: 2000, height: 1000 });
    const { drawImage, toBlob } = mockCanvas();
    const largeFile = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'product.jpg', {
      type: 'image/jpeg',
      lastModified: 100,
    });
    const { container } = render(<CreatePage />);

    upload(container, largeFile);

    await waitFor(() => {
      expect(setUploadedFile).toHaveBeenCalledTimes(1);
    });
    const preparedFile = setUploadedFile.mock.calls[0][0] as File;

    expect(preparedFile).not.toBe(largeFile);
    expect(preparedFile.name).toBe('product.jpg');
    expect(preparedFile.type).toBe('image/jpeg');
    expect(preparedFile.lastModified).toBe(100);
    expect(preparedFile.size).toBeLessThan(largeFile.size);
    expect(drawImage).toHaveBeenCalledWith(expect.any(Object), 0, 0, 1024, 512);
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.85);
    expect(setPreviewUrl).toHaveBeenCalledWith(expect.stringMatching(/^blob:product\.jpg:/));
  });

  test('小图不处理，直接使用原始 File', async () => {
    mockImage({ width: 800, height: 600 });
    const { toBlob } = mockCanvas();
    const smallFile = new File(['small image'], 'small.png', { type: 'image/png' });
    const { container } = render(<CreatePage />);

    upload(container, smallFile);

    await waitFor(() => {
      expect(setUploadedFile).toHaveBeenCalledWith(smallFile);
    });
    expect(toBlob).not.toHaveBeenCalled();
    expect(setPreviewUrl).toHaveBeenCalledWith(expect.stringMatching(/^blob:small\.png:/));
  });

  test('处理失败时显示明确错误提示', async () => {
    mockImage({ width: 1600, height: 1200, fail: true });
    mockCanvas();
    const file = new File(['broken image'], 'broken.jpg', { type: 'image/jpeg' });
    const { container } = render(<CreatePage />);

    upload(container, file);

    expect(await screen.findByText('图片处理失败，请更换图片后重试')).toBeInTheDocument();
    expect(setUploadedFile).not.toHaveBeenCalled();
    expect(setPreviewUrl).not.toHaveBeenCalled();
  });
});
