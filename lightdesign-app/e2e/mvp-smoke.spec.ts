import { expect, test } from '@playwright/test';

const SAMPLE_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAukB9VEWil8AAAAASUVORK5CYII=',
  'base64',
);

test('completes the mocked create to export flow and shows the recent task on the dashboard', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.goto('/dashboard');

  await page.locator('input[type="file"]').setInputFiles({
    name: 'sample-product.png',
    mimeType: 'image/png',
    buffer: SAMPLE_PNG,
  });

  await page.getByPlaceholder('卖点 1（必填），如：限时五折抢购').fill('限时五折');
  await page.getByPlaceholder('卖点 2（必填），如：买二送一').fill('买二送一');
  await page.getByRole('button', { name: '亚马逊' }).click();
  await page.getByRole('button', { name: '简约白底' }).click();
  await page.getByRole('button', { name: '生成产品主图' }).click();

  await expect(page).toHaveURL(/\/generating$/);
  await expect(page.getByText('生成中')).toBeVisible();
  await page.waitForURL(/\/result$/, { timeout: 15_000 });

  await expect(page.getByRole('img', { name: '产品主图' })).toBeVisible();
  await expect(page.getByText('对话调整')).toBeVisible();

  await page.getByRole('button', { name: '导出此版本' }).click();
  await expect(page.getByText('图片已导出（PNG）')).toBeVisible();

  const tasks = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('lightdesign_tasks') || '[]');
  });

  expect(tasks).toHaveLength(1);
  expect(tasks[0]).toMatchObject({
    title: '商品主图 · 简约白底',
    platform: 'amazon',
    style: 'clean',
    status: 'exported',
  });

  await page.goto('/dashboard');
  await expect(page.getByText('商品主图 · 简约白底')).toBeVisible();
  await expect(page.getByText(/亚马逊 · 简约白底/)).toBeVisible();
  await expect(page.getByText('已导出')).toBeVisible();
});
