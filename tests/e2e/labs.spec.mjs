import { test, expect } from '@playwright/test';

test('dashboard renders the learning overview', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: '把每一次调试，变成可复用的能力。' }),
  ).toBeVisible();
  await expect(page.locator('#module-grid .module-card')).toHaveCount(8);
  await expect(page.locator('#api-status')).toContainText('靶场在线');
});

test('code workspace runs closure example', async ({ page }) => {
  await page.goto('/#workspace');
  await page.getByRole('button', { name: '▶ 运行代码' }).click();
  await expect(page.locator('#console-output')).toContainText('1');
  await expect(page.locator('#console-output')).toContainText('2');
  await expect(page.locator('#console-output')).toContainText('3');
});

test('network lab loads products from the local API', async ({ page }) => {
  await page.goto('/labs/01-network/');
  await page.getByRole('button', { name: '请求第 1 页', exact: true }).click();
  await expect(page.locator('#fetch-output')).toContainText('机械键盘');
});

test('crypto lab signs a local teaching payload', async ({ page }) => {
  await page.goto('/labs/04-crypto/');
  await page.getByRole('button', { name: '生成签名并请求本地验证' }).click();
  await expect(page.locator('#crypto-output')).toContainText('本地演示签名验证通过');
});

test('websocket lab receives a local message', async ({ page }) => {
  await page.goto('/labs/06-websocket/');
  await page.getByRole('button', { name: '连接' }).click();
  await expect(page.locator('#ws-output')).toContainText('已连接本地库存推送', { timeout: 10000 });
});
