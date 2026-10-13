import { expect, type Locator, type Page } from '@playwright/test';
import { ContactForm } from './ContactForm';

/** Page-level locators and navigation for the public B&B homepage. */
export class HomePage {
  readonly mainHeading: Locator;
  readonly introduction: Locator;
  readonly roomsHeading: Locator;
  readonly roomHeadings: Locator[];
  readonly bookingHeading: Locator;
  readonly locationHeading: Locator;
  readonly contactInformationHeading: Locator;
  readonly contactFormHeading: Locator;
  readonly contactForm: ContactForm;

  constructor(private readonly page: Page) {
    this.mainHeading = page.getByRole('heading', {
      name: 'Welcome to Shady Meadows B&B',
      level: 1,
    });
    this.introduction = page.getByText(
      /delightful Bed & Breakfast nestled in the hills/,
    ).first();
    this.roomsHeading = page.getByRole('heading', { name: 'Our Rooms', level: 2 });
    this.roomHeadings = ['Single', 'Double', 'Suite'].map((name) =>
      page.getByRole('heading', { name, level: 5 }),
    );
    this.bookingHeading = page.getByRole('heading', {
      name: 'Check Availability & Book Your Stay',
      level: 3,
    });
    this.locationHeading = page.getByRole('heading', { name: 'Our Location', level: 2 });
    this.contactInformationHeading = page.getByRole('heading', {
      name: 'Contact Information',
      level: 3,
    });
    this.contactFormHeading = page.getByRole('heading', {
      name: 'Send Us a Message',
      level: 3,
    });
    this.contactForm = new ContactForm(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(/Restful-booker-platform demo/);
  }
}