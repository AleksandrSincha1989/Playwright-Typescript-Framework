# Playwright-Typescript-Framework

`Playwright-Typescript-Framework` is a Playwright and TypeScript QA automation framework for browser-based UI scenarios against `the-internet.herokuapp.com`, API scenarios against `jsonplaceholder.typicode.com`, and centralized environment, brand, and account selection through configuration providers.

## Tech Stack

- TypeScript
- Playwright Test
- Playwright API testing via `APIRequestContext`
- Allure reporting
- `cross-env` for cross-platform command support

## What Is Included

- UI automation using page objects and step classes
- API tests with a small client/steps layer
- Environment and brand based runtime configuration
- Worker-aware account allocation for parallel execution
- HTML and Allure report generation

## Project Structure

```text
config/
  accounts/        brand and environment specific account sets
  environments/    base URLs for UI and API targets
src/
  api/             API client, models, and reusable API steps
  config/          framework configuration providers
  fixtures/        shared Playwright fixtures
  logging/         test logging helpers
  ui/              page objects and UI step classes
tests/
  api/             API specs
  ui/              UI specs
scripts/
  clean.js         generated artifact cleanup
```

## Prerequisites

- Node.js 18+ recommended
- npm
- Playwright browsers installed
- Java installed locally if you want to generate or open Allure reports

## Installation

```bash
npm install
npx playwright install
```

## Running UI Tests

Run the full UI suite:

```bash
npm run test:ui
```

Run headed:

```bash
npm run test:headed
```

Run with explicit environment and brand:

```bash
npx cross-env TEST_ENV=dev TEST_BRAND=brandA playwright test tests/ui
```

Run smoke or tagged subsets:

```bash
npx playwright test tests/ui --grep "@smoke"
npx playwright test tests/ui --grep "@TMS-1001"
```

## Running API Tests

Run the full API suite:

```bash
npm run test:api
```

Run with explicit environment and brand:

```bash
npx cross-env TEST_ENV=uat TEST_BRAND=brandB playwright test tests/api
```

Run tagged API subsets:

```bash
npx playwright test --grep "@API"
```

## Configuration Model

Framework configuration is assembled in `src/config/frameworkConfigProvider.ts`. Tests and helpers should use that provider chain instead of reading JSON files directly.

Selection inputs:

- `TEST_ENV` selects the environment folder, such as `dev` or `uat`
- `TEST_BRAND` selects the brand file inside the environment folder

Resolved files:

- `config/environments/<env>/<brand>.json`
- `config/accounts/<env>/<brand>.json`

Supported overrides:

- `BASE_URL` or `PW_BASE_URL` for UI base URL
- `API_BASE_URL` for API base URL
- `BROWSER` or `PW_BROWSER` for browser choice
- `HEADLESS` or `PW_HEADLESS` for headless mode
- `WORKERS` or `PW_WORKERS` for worker count
- `PW_SLOW_MO`, `PW_DEFAULT_TIMEOUT`, `PW_VIEWPORT_WIDTH`, `PW_VIEWPORT_HEIGHT` for execution tuning

## Accounts and Test Data

The account files currently use the public demo credentials for `the-internet.herokuapp.com`. Those credentials are intentionally kept because they are required for the sample login scenarios and are safe for a public demo project.

If this framework is reused against a private system, move real credentials out of committed JSON files and load them from a secure secret source in CI or from local overrides that are gitignored.

## Reports and Artifacts

Playwright generates HTML reports in `playwright-report/` and test artifacts in `test-results/`. Allure writes raw results to `allure-results/` and generated reports to `allure-report/`.

These folders are intentionally gitignored and can be cleaned with:

```bash
npm run clean
npm run clean:allure
```

Generate or open Allure reports locally:

```bash
npm run allure:generate
npm run allure:open
```

## CI/CD Intent

This project is set up for straightforward CI execution and artifact publishing. A typical pipeline should:

1. Install dependencies with `npm ci`
2. Install Playwright browsers with `npx playwright install --with-deps` when needed by the runner
3. Execute UI and API suites with explicit `TEST_ENV`, `TEST_BRAND`, and `HEADLESS=true`
4. Publish `playwright-report/`, `test-results/`, or generated Allure artifacts as pipeline artifacts when useful
5. Inject any non-demo secrets from the CI secret store rather than from committed files

## Suggested Review Checklist Before First Push

- Confirm no private credentials or tokens were added to config files
- Confirm generated reports and local folders remain untracked
- Confirm package metadata and repository name match your GitHub repository
- Confirm CI defaults, browser choice, and worker count match your intended usage

## Useful Commands

```bash
npm test
npm run test:ui
npm run test:api
npm run typecheck
npm run clean
```
