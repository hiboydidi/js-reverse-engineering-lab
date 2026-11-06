import { test, expect } from '@playwright/test';

test('Trace Studio traces local functions and compares implementations', async ({ page }) => {
  await page.goto('/labs/08-trace/');
  await expect(page.getByRole('heading', { name: 'JavaScript 执行追踪实验室' })).toBeVisible();

  await page.getByRole('button', { name: '▶ 追踪 A' }).click();
  await expect(page.locator('#metric-calls')).toHaveText('5');
  await expect(page.locator('#edge-list')).toContainText('lineTotal');
  await expect(page.locator('#run-output')).toContainText('180');

  await page.getByRole('button', { name: '对比 A / B' }).click();
  await expect(page.locator('#metric-match')).toHaveText('一致');
  await expect(page.locator('#compare-output')).toContainText('MATCH');

  await page.getByRole('button', { name: '制造差异' }).click();
  await page.getByRole('button', { name: '对比 A / B' }).click();
  await expect(page.locator('#metric-match')).toHaveText('不一致');
  await expect(page.locator('#compare-output')).toContainText('MISMATCH');
});
