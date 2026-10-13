import { test, expect } from '@playwright/test';

test('home page opens and shows its main heading', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle(/Restful-booker-platform demo/);
  await expect(
    page.getByRole('heading', { name: 'Welcome to Shady Meadows B&B', level: 1 }),
  ).toBeVisible();
});

test.describe('homepage content', () => {
  test('shows the B&B introduction', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByText(/delightful Bed & Breakfast nestled in the hills/).first(),
    ).toBeVisible();
  });

  test('lists the available room types', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Our Rooms', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Single', level: 5 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Double', level: 5 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Suite', level: 5 })).toBeVisible();
  });

  test('shows the main booking, location, and contact sections', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('heading', { name: 'Check Availability & Book Your Stay', level: 3 }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Our Location', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contact Information', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Send Us a Message', level: 3 })).toBeVisible();
  });
});
