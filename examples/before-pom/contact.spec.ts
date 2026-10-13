import { test, expect } from '@playwright/test';

const invalidContactCases = [
  {
    name: 'an empty submission',
    values: {},
    expectedMessage: 'Name may not be blank',
  },
  {
    name: 'an invalid email address',
    values: {
      Name: 'Playwright Learner',
      Email: 'not-an-email',
      Phone: '01234567890',
      Subject: 'Contact form validation',
      Message: 'This is long enough to be a valid test message.',
    },
    expectedMessage: 'must be a well-formed email address',
  },
];

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('submits a valid message and shows a personalized confirmation', async ({ page }) => {
    await page.getByLabel('Name').fill('Playwright Learner');
    await page.getByLabel('Email').fill('playwright@example.com');
    await page.getByLabel('Phone').fill('01234567890');
    await page.getByLabel('Subject').fill('Playwright contact test');
    await page.getByTestId('ContactDescription').fill(
      'This is a valid test message for the contact form.',
    );
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Thanks for getting in touch Playwright Learner!')).toBeVisible();
    await expect(page.getByText('Playwright contact test', { exact: true })).toBeVisible();
  });

  for (const invalidCase of invalidContactCases) {
    test(`shows validation for ${invalidCase.name}`, async ({ page }) => {
      for (const [label, value] of Object.entries(invalidCase.values)) {
        const field = label === 'Message'
          ? page.getByTestId('ContactDescription')
          : page.getByLabel(label);
        await field.fill(value);
      }

      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.locator('.alert-danger')).toContainText(invalidCase.expectedMessage);
    });
  }
});
