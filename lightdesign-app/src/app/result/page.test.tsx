import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import ResultPage from '@/app/result/page';
import type { GenerationInput, GenerationResult } from '@/lib/types';

const push = vi.fn();
const replace = vi.fn();

const input: GenerationInput = {
  selling1: '限时五折',
  selling2: '全国包邮',
  platform: 'general',
  style: 'clean',
};

const result: GenerationResult = {
  imageUrl: 'data:image/svg+xml;base64,PHN2Zy8+',
  platform: 'general',
  style: 'clean',
  generatedAt: '2026-05-05T10:00:00.000Z',
  prompt: 'mock prompt',
};

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('@/components/GenContext', () => ({
  useGen: () => ({ result, input }),
}));

describe('ResultPage', () => {
  beforeEach(() => {
    push.mockReset();
    replace.mockReset();
    localStorage.clear();
  });

  test('writes exported result to recent tasks', async () => {
    const click = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = document.createElementNS('http://www.w3.org/1999/xhtml', tagName) as HTMLElement;
      if (tagName === 'a') {
        Object.defineProperty(element, 'click', { value: click });
      }
      return element;
    });

    render(<ResultPage />);

    await waitFor(() => {
      expect(screen.getByText('对话调整')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/已根据你的商品信息/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '导出此版本' }));

    const tasks = JSON.parse(localStorage.getItem('lightdesign_tasks') || '[]');
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      title: '商品主图 · 简约白底',
      platform: 'general',
      style: 'clean',
      status: 'exported',
    });
    expect(click).toHaveBeenCalledTimes(1);
  });
});
