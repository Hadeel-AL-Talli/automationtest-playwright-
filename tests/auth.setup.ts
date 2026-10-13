import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../pages/AdminLoginPage';

// Public demo credentials from the application documentation; override via env if needed.
const username = process.env.ADMIN_USERNAME ?? 'admin';
const password = process.env.ADMIN_PASSWORD ?? 'password';
const authFile = resolve(__dirname, '../playwright/.auth/admin.json');

test('authenticate admin and save browser state', async ({ page }) => {
  const adminLoginPage = new AdminLoginPage(page);
  await adminLoginPage.goto();
  await adminLoginPage.login(username, password);

  // Wait for an authenticated-only UI element before saving cookies/local storage.
  await expect(adminLoginPage.logoutButton).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/rooms$/);

  await mkdir(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
