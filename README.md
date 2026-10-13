# Playwright B&B Automation

A TypeScript end-to-end and API test project for the public demo application at [automationintesting.online](https://automationintesting.online/). It uses Playwright Test and runs public tests on Chromium, Firefox, and WebKit. Admin authentication and authenticated UI/API tests run on Chromium.

> This is a public demo site. Its data is shared and may change. Keep tests isolated, use unique names for created data, and clean up after mutating tests.

## Requirements

- Node.js 20 or later
- npm
- Playwright browser binaries matching the installed Playwright version

## Install

From this directory, install dependencies and the required browsers:

```bash
npm ci
npx playwright install chromium firefox webkit
```

The project was initialized with `npm init playwright@latest` using TypeScript. Browser installation is a separate step and may take some time on a slow connection.

## Run tests

Run the full suite (Chromium, Firefox, WebKit, plus the Chromium setup/authenticated projects):

```bash
npx playwright test
```

Useful focused commands:

```bash
# Run one spec
npx playwright test tests/home.spec.ts

# Run one browser project
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=chromium

# Run a specific test by title substring
npx playwright test --grep "lists the available room types"

# Show the browser while running
npx playwright test --headed

# The shared demo can be unstable under concurrent traffic; serialize as configured,
# or explicitly repeat a flaky run once while retaining flaky status in the report.
npx playwright test --workers=1 --retries=1

# Interactive runner, Inspector, and locator/codegen tools
npx playwright test --ui
npx playwright test --debug
npx playwright codegen https://automationintesting.online/
```

Tests already use one worker because the shared demo has intermittently returned a loading page when several browser sessions hit it at once. Retries can help diagnose transient site/network failures, but a retry should not replace investigating a genuine failure.

## Reports and debugging

The HTML report is written to `playwright-report/` after a run. Open it from this project directory with:

```bash
npx playwright show-report
```

To view an individual trace from a failed test:

```bash
npx playwright show-trace test-results/<failed-test-folder>/trace.zip
```

Trace files are retained on failures. In Trace Viewer, inspect the action timeline, select an action to see its parameters and timing, compare the **Before** and **After** DOM snapshots, and use **Errors**, **Console**, **Network**, **Source**, and **Attachments** to investigate further. Screenshots and videos are also retained for failures. Generated reports, traces, screenshots, and videos are ignored by Git.

## Authentication

The demo's documented default credentials are `admin` / `password`. Tests can override them through environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

The setup project logs in and saves browser storage state under `playwright/.auth/admin.json`. The authenticated Chromium project depends on setup and loads that state. The `.auth` directory is gitignored because saved browser state can contain credentials or session tokens. Do not commit it, and do not use real account credentials on this public demo.

## Project structure

```text
pages/                         Page objects and UI interactions
  AdminLoginPage.ts            Admin login and authenticated controls
  ContactForm.ts                Contact form locators and actions
  HomePage.ts                   Public homepage locators and navigation
fixtures/
  test.ts                       Custom Playwright test with page-object fixtures
test-data/
  rooms.ts                       Expected public room API data
tests/
  api.spec.ts                    Public rooms API contract check
  admin.spec.ts                  Valid and invalid admin login
  auth.setup.ts                  Create reusable admin storage state
  contact.spec.ts                Contact form happy path and validation
  home.spec.ts                   Homepage smoke and content assertions
  authenticated/
    admin.spec.ts                Verify restored admin session
    room-api-ui.spec.ts          Create by API, verify in UI, clean up
examples/
  before-pom/                    Earlier locator-based tests for comparison
playwright.config.ts             Test settings and browser/auth projects
package.json / package-lock.json Dependencies and test script
playwright/.auth/                Generated login state (gitignored)
playwright-report/               Generated HTML report (gitignored)
test-results/                    Generated diagnostics (gitignored)
```

## Concepts practiced

- **Fixtures:** Playwright provides isolated `page` and `request` fixtures; `fixtures/test.ts` extends `test` with page objects.
- **Locators:** Prefer accessible locators such as `getByRole()` and `getByLabel()`. The live Message label is miswired, so its observed `ContactDescription` test ID is used as a fallback.
- **Auto-waiting:** Locator actions and web-first assertions wait for actionable/expected UI states. Avoid fixed sleeps such as `waitForTimeout()`.
- **Assertions:** `expect(locator).toBeVisible()` and other locator assertions retry; generic value comparisons check the already-obtained value.
- **Test organization:** `test.describe()`, `test.beforeEach()`, and data-driven cases group related scenarios while keeping each case independently reportable.
- **Page Object Model:** Page classes centralize locators and interactions; specs retain business assertions. `examples/before-pom/` preserves the earlier version for comparison.
- **Authentication:** A setup project and dependency create `storageState` once for authenticated Chromium tests.
- **API + UI:** The API test checks `GET /api/room`; the authenticated integration test creates a room with `POST /api/room`, verifies it in the admin UI, and removes it with `DELETE /api/room/{id}`.
- **Diagnostics and browser coverage:** HTML reports, failure screenshots/videos/traces, and Chromium/Firefox/WebKit projects help find regressions.

### Observed API endpoints

The browser Network panel showed:

- `GET /api/branding` — branding configuration requested by the public site.
- `GET /api/room` — room list used by the public and admin interfaces.
- `POST /api/auth/login` and `POST /api/auth/validate` — admin login/session validation.
- `GET /api/message/count` — admin message count.
- `POST /api/room` and `DELETE /api/room/{id}` — observed admin room creation and deletion.

The project currently tests the room list and the create/read/UI/delete workflow. Inspect the Network panel again before adding assumptions about other endpoints or their response shapes.

## Suggested next topics

1. **Visual testing:** `toHaveScreenshot()` with intentional baselines and review of diffs.
2. **Network mocking:** `page.route()` to simulate slow, failed, or specific API responses without relying on the public server.
3. **Parallelism and sharding:** Reduce runtime on a stable test environment; assess shared-data isolation first.
4. **CI:** Extend the starter GitHub Actions workflow, save the HTML report as an artifact, and consider browser installation caching.
5. **More robust test data:** Add cleanup helpers, API fixtures, and unique generated values for mutations against shared systems.
