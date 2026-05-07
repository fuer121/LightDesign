import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import DashboardPage from '@/app/dashboard/page';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    push.mockReset();
    localStorage.clear();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  test('loads recent tasks from localStorage on mount', async () => {
    localStorage.setItem('lightdesign_tasks', JSON.stringify([
      {
        id: 'task-1',
        title: '商品主图 · 简约白底',
        platform: 'amazon',
        style: 'clean',
        date: '2026/05/05 10:00',
        status: 'exported',
      },
    ]));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('商品主图 · 简约白底')).toBeInTheDocument();
    });
    expect(screen.getByText(/亚马逊 · 简约白底/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '复用模板' })).toBeInTheDocument();
  });
});
