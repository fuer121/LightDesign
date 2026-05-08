import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import HomePage from '@/app/page';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('HomePage', () => {
  test('renders concise landing page with dashboard entry point', () => {
    render(<HomePage />);

    expect(screen.getByText('GPT image 2 电商图工作台')).toBeInTheDocument();
    expect(screen.getByText('商品图示意')).toBeInTheDocument();
    expect(screen.getByText('上传')).toBeInTheDocument();
    expect(screen.getByText('调整')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /进入工作台/ })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: '查看效果' })).toHaveAttribute('href', '#showcase');
  });

  test('uses local showcase assets for four product categories', () => {
    render(<HomePage />);

    expect(screen.getByAltText('甜品杯 商品图示意')).toHaveAttribute('src', '/showcase/icecream.png');
    expect(screen.getByAltText('篮球鞋 商品图示意')).toHaveAttribute('src', '/showcase/sneakers.png');
    expect(screen.getByAltText('机械键盘 商品图示意')).toHaveAttribute('src', '/showcase/keyboard.png');
    expect(screen.getByAltText('徒步背包 商品图示意')).toHaveAttribute('src', '/showcase/backpack.png');
  });
});
