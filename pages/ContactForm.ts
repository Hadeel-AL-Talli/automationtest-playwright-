import type { Locator, Page } from '@playwright/test';

export type ContactField = 'Name' | 'Email' | 'Phone' | 'Subject' | 'Message';

/** Locators and user actions for the contact form embedded on the homepage. */
export class ContactForm {
  readonly submitButton: Locator;
  readonly validationAlert: Locator;

  constructor(private readonly page: Page) {
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.validationAlert = page.locator('.alert-danger');
  }

  async fillField(label: ContactField, value: string): Promise<void> {
    // The live page's Message label points to the wrong textarea id; its test id is the reliable fallback.
    const field = label === 'Message'
      ? this.page.getByTestId('ContactDescription')
      : this.page.getByLabel(label);
    await field.fill(value);
  }

  async fill(values: Partial<Record<ContactField, string>>): Promise<void> {
    for (const [label, value] of Object.entries(values) as [ContactField, string][]) {
      await this.fillField(label, value);
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  confirmationFor(name: string): Locator {
    return this.page.getByText(`Thanks for getting in touch ${name}!`);
  }

  confirmationSubject(subject: string): Locator {
    return this.page.getByText(subject, { exact: true });
  }
}