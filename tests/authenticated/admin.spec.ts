import { test, expect } from '../../fixtures/test';

test('opens the admin room dashboard using saved authentication', async ({ page, adminLoginPage }) => {
  // The chromium-authenticated project loads the storage state created by auth.setup.ts.
  await adminLoginPage.goto();

  await expect(page).toHaveURL(/\/admin\/rooms$/);
  await expect(adminLoginPage.logoutButton).toBeVisible();
  await expect(page.getByRole('link', { name: 'Rooms' })).toBeVisible();
});
