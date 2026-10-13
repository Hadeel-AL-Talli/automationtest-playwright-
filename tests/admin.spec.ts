import { test, expect } from '../fixtures/test';
import { env } from 'node:process';

const validUsername = env.ADMIN_USERNAME ?? 'admin';
const validPassword = env.ADMIN_PASSWORD ?? 'password';

test.describe('admin login', () => {
  test.beforeEach(async ({ adminLoginPage }) => {
    await adminLoginPage.goto();
    await expect(adminLoginPage.loginHeading).toBeVisible();
  });

  test('accepts valid credentials', async ({ page, adminLoginPage }) => {
    await adminLoginPage.login(validUsername, validPassword);

    await expect(page).toHaveURL(/\/admin\/rooms$/);
    await expect(adminLoginPage.logoutButton).toBeVisible();
  });

  test('rejects an invalid password', async ({ adminLoginPage }) => {
    await adminLoginPage.login(validUsername, 'definitely-not-the-password');

    await expect(adminLoginPage.invalidCredentialsAlert).toContainText('Invalid credentials');
    await expect(adminLoginPage.loginHeading).toBeVisible();
  });
});
