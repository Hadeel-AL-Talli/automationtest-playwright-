import { env } from 'node:process';
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Keep one shared timeout budget for each test. */
  timeout: 30_000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!env.CI,
  /* Retry on CI only */
  retries: env.CI ? 2 : 0,
  /* Keep requests to the shared demo site serial while its homepage is unstable under parallel load. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* Print concise progress to the terminal and keep the HTML report. */
  reporter: [['list'], ['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://automationintesting.online',

    /* Capture useful diagnostics only when a test fails or is retried. */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Keep a trace of failures so the Trace Viewer can explain the action timeline. */
    trace: 'retain-on-failure',
  },

  /* Run public-page tests without saved authentication. */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: [/auth\.setup\.ts/, '**/authenticated/**'],
    },

    /* Cross-browser projects exercise the public suite in Firefox and WebKit. */
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: [/auth\.setup\.ts/, '**/authenticated/**'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: [/auth\.setup\.ts/, '**/authenticated/**'],
    },

    /* Create the reusable storage state before authenticated tests run. */
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    /* Authenticated-only tests consume the state produced by the setup project. */
    {
      name: 'chromium-authenticated',
      testMatch: '**/authenticated/**/*.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
