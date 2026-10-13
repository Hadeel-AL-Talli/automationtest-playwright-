import { test as base, expect } from '@playwright/test';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { ContactForm } from '../pages/ContactForm';
import { HomePage } from '../pages/HomePage';

type PageObjectFixtures = {
  homePage: HomePage;
  contactForm: ContactForm;
  adminLoginPage: AdminLoginPage;
};

/** Shared test entry point that constructs page objects with Playwright's page fixture. */
export const test = base.extend<PageObjectFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  contactForm: async ({ page }, use) => {
    await use(new ContactForm(page));
  },
  adminLoginPage: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },
});

export { expect };
