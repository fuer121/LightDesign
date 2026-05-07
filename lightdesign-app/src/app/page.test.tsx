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
  test('renders premium landing sections with create and dashboard entry points', () => {
    render(<HomePage />);

    expect(screen.getByText('让商品图像完成成交前的第一眼。')).toBeInTheDocument();
    expect(screen.getByText('横向滚动的电商图效果墙')).toBeInTheDocument();
    expect(screen.getByText('从商品照片到可调整结果，只保留必要步骤。')).toBeInTheDocument();
    expect(screen.getByText('真实扩样本链路已经跑通。')).toBeInTheDocument();
    expect(screen.getByText('覆盖常见电商主图场景。')).toBeInTheDocument();

    const createLinks = screen.getAllByRole('link', { name: /开始创作/ });
    expect(createLinks.length).toBeGreaterThanOrEqual(2);
    expect(createLinks.every(link => link.getAttribute('href') === '/create')).toBe(true);
    expect(screen.getByRole('link', { name: '查看工作台' })).toHaveAttribute('href', '/dashboard');
  });

  test('uses local showcase assets for four product categories', () => {
    render(<HomePage />);

    expect(screen.getByAltText('Gelato 甜品杯 高级电商图示意')).toHaveAttribute('src', '/showcase/icecream.png');
    expect(screen.getByAltText('白色篮球鞋 高级电商图示意')).toHaveAttribute('src', '/showcase/sneakers.png');
    expect(screen.getByAltText('RGB 机械键盘 高级电商图示意')).toHaveAttribute('src', '/showcase/keyboard.png');
    expect(screen.getByAltText('战术徒步背包 高级电商图示意')).toHaveAttribute('src', '/showcase/backpack.png');
  });
});
