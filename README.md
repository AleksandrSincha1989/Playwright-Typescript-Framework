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

GitHub Actions workflow has been added at `.github/workflows/playwright-ci.yml`.

The workflow runs on `push` and `pull_request` and performs:

1. Install dependencies with `npm ci`
2. Apply safe CI defaults for `TEST_ENV`, `TEST_BRAND`, `BROWSER`, `HEADLESS`, and `WORKERS`
3. Optionally append `BASE_URL` and `API_BASE_URL` only when GitHub variables are defined
4. Install the requested Playwright browser with `npx playwright install --with-deps`
5. Run `npm run typecheck`
6. Clean previous generated artifacts with `npm run clean`
7. Run the suite with `npm test`
8. Upload `playwright-report/`, `test-results/`, and `allure-results/` as GitHub Actions artifacts

The workflow intentionally uses the existing provider chain and Playwright config without bypassing:

- `TEST_ENV` and `TEST_BRAND` selection
- `frameworkConfigProvider` URL and execution overrides
- `environmentProvider` file resolution
- `accountProvider` worker validation and worker-based account allocation
- existing logging, tags, TMS tags, screenshot on failure, and trace on first retry behavior

## Running Locally Vs CI

Local default run:

```bash
npm test
```

Local run with explicit overrides:

```bash
npx cross-env TEST_ENV=uat TEST_BRAND=brandB BROWSER=chromium HEADLESS=true WORKERS=2 playwright test
```

GitHub Actions CI run:

- uses the same `npm test` entry point
- defaults to `TEST_ENV=dev`, `TEST_BRAND=brandA`, `BROWSER=chromium`, `HEADLESS=true`, and `WORKERS=2`
- can be extended later through GitHub repository or environment variables without changing framework architecture

## CI Variables And Overrides

The workflow is ready for future GitHub Actions overrides through repository or environment `Variables` and `Secrets`.

Supported runtime inputs already understood by the framework:

- `TEST_ENV`
- `TEST_BRAND`
- `BASE_URL`
- `API_BASE_URL`
- `BROWSER`
- `HEADLESS`
- `WORKERS`

Recommended usage:

- keep public-safe demo credentials unchanged for this sample project
- store any future private credentials in GitHub `Secrets`
- store non-sensitive environment-specific overrides in GitHub `Variables`
- avoid hardcoding secret values in workflow YAML

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
npx cross-env TEST_ENV=dev TEST_BRAND=brandA HEADLESS=true playwright test
```
