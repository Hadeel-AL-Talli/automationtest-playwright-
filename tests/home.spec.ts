import { test, expect } from '../fixtures/test';

test.describe('homepage', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('opens and shows its main heading', async ({ homePage }) => {
    await homePage.expectTitle();
    await expect(homePage.mainHeading).toBeVisible();
  });

  test('shows the B&B introduction', async ({ homePage }) => {
    await expect(homePage.introduction).toBeVisible();
  });

  test('lists the available room types', async ({ homePage }) => {
    await expect(homePage.roomsHeading).toBeVisible();
    for (const roomHeading of homePage.roomHeadings) {
      await expect(roomHeading).toBeVisible();
    }
  });

  test('shows the main booking, location, and contact sections', async ({ homePage }) => {
    await expect(homePage.bookingHeading).toBeVisible();
    await expect(homePage.locationHeading).toBeVisible();
    await expect(homePage.contactInformationHeading).toBeVisible();
    await expect(homePage.contactFormHeading).toBeVisible();
  });
});