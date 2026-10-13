import type { Locator, Page } from '@playwright/test';

/** Login-page locators and actions; authentication scenarios are added in Phase 5. */
export class AdminLoginPage {
  readonly loginHeading: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly invalidCredentialsAlert: Locator;
  readonly logoutButton: Locator;

  constructor(private readonly page: Page) {
    this.loginHeading = page.getByRole('heading', { name: 'Login', level: 2 });
    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.invalidCredentialsAlert = page.locator('.alert-danger');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin', { waitUntil: 'domcontentloaded' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}