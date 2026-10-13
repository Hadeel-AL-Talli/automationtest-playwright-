import { test, expect } from '../fixtures/test';
import type { ContactField } from '../pages/ContactForm';

const invalidContactCases: Array<{
  name: string;
  values: Partial<Record<ContactField, string>>;
  expectedMessage: string;
}> = [
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

  test('submits a valid message and shows a personalized confirmation', async ({ contactForm }) => {
    await contactForm.fill({
      Name: 'Playwright Learner',
      Email: 'playwright@example.com',
      Phone: '01234567890',
      Subject: 'Playwright contact test',
      Message: 'This is a valid test message for the contact form.',
    });
    await contactForm.submit();

    await expect(contactForm.confirmationFor('Playwright Learner')).toBeVisible();
    await expect(
      contactForm.confirmationSubject('Playwright contact test'),
    ).toBeVisible();
  });

  // Each data row becomes an independent test with a focused validation expectation.
  for (const invalidCase of invalidContactCases) {
    test(`shows validation for ${invalidCase.name}`, async ({ contactForm }) => {
      await contactForm.fill(invalidCase.values);
      await contactForm.submit();

      // Server-side validation appears in the danger alert.
      await expect(contactForm.validationAlert).toContainText(
        invalidCase.expectedMessage,
      );
    });
  }
});
