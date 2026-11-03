import { test, expect } from '@playwright/test';

test('home page shows the learning labs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'JavaScript 逆向工程实战实验室' })).toBeVisible();
  await expect(page.getByRole('link', { name: '进入实验 →' }).first()).toBeVisible();
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
