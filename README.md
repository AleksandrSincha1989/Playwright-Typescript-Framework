# Playwright TypeScript Framework

Playwright TypeScript Framework is a sample QA automation project for UI and API testing with centralized runtime configuration, worker-safe account allocation, and CI-friendly reporting.

Current demo targets:

- UI: `https://the-internet.herokuapp.com`
- API: `https://jsonplaceholder.typicode.com`

The framework is built to keep UI, API, configuration, fixtures, and reporting concerns separated while still being simple to run locally or from GitHub Actions.

## What This Repository Includes

- Playwright UI tests organized by feature
- Playwright API tests using `APIRequestContext`
- Environment and brand based configuration via providers
- Worker-safe account allocation for parallel runs
- Shared fixtures, logging, and attachments
- Playwright HTML and Allure reporting
- Manual GitHub Actions workflows for UI and API runs
- Optional Allure analytics export from CI

## Tech Stack

- TypeScript
- `@playwright/test`
- `allure-playwright`
- `allure-commandline`
- `cross-env`
- `@faker-js/faker`

## Prerequisites

- Node.js 18 or newer
- npm
- Playwright browsers installed locally
- Java installed locally if you want to open Allure reports

## Installation

```bash
npm install
npx playwright install
```

## Quick Commands

```bash
npm test
npm run test:ui
npm run test:api
npm run test:headed
npm run typecheck
npm run lint
npm run clean
npm run clean:allure
npm run allure:generate
npm run allure:open
npm run allure:report
npx cross-env TEST_ENV=dev TEST_BRAND=brandA playwright test
npx cross-env TEST_ENV=dev TEST_BRAND=brandA playwright test tests/ui
npx cross-env TEST_ENV=uat TEST_BRAND=brandB BROWSER=chromium HEADLESS=true WORKERS=2 playwright test
```

## Project Structure

```text
config/
  accounts/        account pools and named accounts per env and brand
  environments/    UI and API base URLs per env and brand
.github/workflows/
  ui-manual.yml    manual UI workflow
  api-manual.yml   manual API workflow
scripts/
  clean.js                         artifact cleanup
  convert-allure-results.js        Allure analytics normalization
src/
  api/
    client/        low-level API request layer
    models/        API request and response types
    steps/         reusable API flows and assertions
  common/
    factories/     test data factories
  config/          environment, account, and framework config providers
  fixtures/        shared Playwright fixtures
  logging/         per-test logging helpers
  test-data/       static files used by tests
  ui/
    pages/         page objects and selectors
    steps/         UI flows and assertions
tests/
  api/             API specs
  ui/              UI specs
```

## Architecture Summary

### UI Layer

- `src/ui/pages` contains page objects and locators only.
- `src/ui/steps` contains reusable actions and assertions.
- `tests/ui` should stay thin and orchestrate steps rather than embedding framework logic.

### API Layer

- `src/api/client` owns HTTP request details.
- `src/api/steps` wraps API flows and assertions.
- `src/api/models` holds request and response types where useful.
- `tests/api` should stay thin and focus on scenario intent.

### Configuration Layer

- `src/config/environmentProvider.ts` resolves `config/environments/<env>/<brand>.json`.
- `src/config/accountProvider.ts` resolves `config/accounts/<env>/<brand>.json`.
- `src/config/frameworkConfigProvider.ts` is the single entry point for runtime configuration.
- Tests and helpers should use providers and `frameworkConfig`, not read JSON directly.

### Fixture and Logging Layer

- `src/fixtures/test-fixtures.ts` extends Playwright fixtures with account access, logging, and browser console capture.
- `src/logging/TestLogger.ts` writes per-test logs and attaches them to Playwright results.
- Screenshots are captured only on failure, and traces are kept on first retry.

## Configuration Model

Runtime selection is based on environment and brand:

- `TEST_ENV` selects the environment folder, for example `dev` or `uat`
- `TEST_BRAND` selects the brand file, for example `brandA` or `brandB`

Resolved files:

- `config/environments/<env>/<brand>.json`
- `config/accounts/<env>/<brand>.json`

Default selection:

- `TEST_ENV=dev`
- `TEST_BRAND=brandA`

Supported runtime overrides:

- `BASE_URL` or `PW_BASE_URL`
- `API_BASE_URL`
- `BROWSER` or `PW_BROWSER`
- `HEADLESS` or `PW_HEADLESS`
- `WORKERS` or `PW_WORKERS`
- `PW_SLOW_MO`
- `PW_DEFAULT_TIMEOUT`
- `PW_VIEWPORT_WIDTH`
- `PW_VIEWPORT_HEIGHT`

Supported browsers:

- `chromium`
- `firefox`
- `webkit`

Behavioral notes:

- Browser defaults to `chromium`.
- Headless defaults to `false` locally unless overridden.
- Workers default to `2`.
- The account provider validates that the default account pool is large enough for the requested worker count.

## Accounts and Parallel Execution

Account files contain two groups:

- `default`: the worker pool used for parallel execution
- `named`: explicitly addressable accounts for tests that need a specific persona

Worker allocation rules:

- Each worker receives its account from the `default` pool using `workerIndex`.
- Worker pool validation fails fast if configured workers exceed available default accounts.
- Named accounts are retrieved by key and produce a clear error if the name is missing.

This model avoids shared mutable state and keeps parallel account usage deterministic.

## Running Tests

Run the full suite:

```bash
npm test
```

Run UI tests only:

```bash
npm run test:ui
npx cross-env TEST_ENV=dev TEST_BRAND=brandA playwright test tests/ui
```

Run API tests only:

```bash
npm run test:api
npx cross-env TEST_ENV=uat TEST_BRAND=brandB playwright test tests/api
```

Run with browser, headless, and worker overrides:

```bash
npx cross-env TEST_ENV=uat TEST_BRAND=brandB BROWSER=chromium HEADLESS=true WORKERS=2 playwright test
```

Run tagged subsets:

```bash
npx playwright test tests/ui --grep "@TMS-1001"
npx playwright test --grep "@API"
npx playwright test --grep "@TMS-1008|@TMS-1010"
```

Run validation commands:

```bash
npm run typecheck
npm run lint
```

## Playwright and Reporting Behavior

Playwright is configured in `playwright.config.ts` to:

- run fully parallel
- use worker count from `frameworkConfig`
- use base URL, browser, headless mode, viewport, and timeouts from `frameworkConfig`
- keep screenshots `only-on-failure`
- keep trace `on-first-retry`
- disable video

Generated outputs:

- `playwright-report/`: Playwright HTML report
- `test-results/`: Playwright attachments and test artifacts
- `allure-results/`: raw Allure result files
- `allure-report/`: generated Allure HTML
- `normalized-run.json`: normalized analytics payload generated from Allure results

Cleanup commands:

```bash
npm run clean
npm run clean:allure
```

Allure commands:

```bash
npm run allure:generate
npm run allure:open
npm run allure:report
npm run allure:convert
```

`npm run allure:convert` calls `scripts/convert-allure-results.js` and converts Allure `*-result.json` files into a normalized JSON payload for analytics upload.

## GitHub Actions Workflows

The repository contains two manual workflows:

- `.github/workflows/ui-manual.yml`
- `.github/workflows/api-manual.yml`

Both workflows use `workflow_dispatch`.

API workflow inputs:

- `environment`
- `brand`
- `workers`

UI workflow inputs:

- `environment`
- `brand`
- `browser`
- `headless`
- `workers`

API workflow input mapping:

- `environment` -> `TEST_ENV`
- `brand` -> `TEST_BRAND`
- `workers` -> `WORKERS`

API workflow uses fixed execution defaults for Playwright internals:

- `BROWSER=chromium`
- `HEADLESS=true`

API analytics metadata always uses `browser=api`.

UI workflow input mapping:

- `environment` -> `TEST_ENV`
- `brand` -> `TEST_BRAND`
- `browser` -> `BROWSER`
- `headless` -> `HEADLESS`
- `workers` -> `WORKERS`

Both workflows perform:

1. checkout
2. Node.js setup with npm cache
3. `npm ci`
4. optional `BASE_URL` and `API_BASE_URL` export from GitHub Variables
5. Playwright browser installation with `npx playwright install --with-deps <browser>`
6. `npm run typecheck`
7. `npm run clean`
8. suite execution through `npm run test:ui` or `npm run test:api`
9. `npm run allure:convert` when `allure-results/` exists
10. optional analytics upload when `ANALYTICS_IMPORT_URL` is configured
11. previous Allure history restore from the matching GitHub Pages report path
12. `npm run allure:generate`
13. artifact upload
14. Allure publication to GitHub Pages

Artifacts uploaded with `if: always()`:

- Playwright HTML report
- test results and attachments
- Allure raw results
- Allure HTML report

GitHub Pages publication:

- UI workflow publishes to `/ui/` on the `gh-pages` branch
- API workflow publishes to `/api/` on the `gh-pages` branch
- each workflow restores only its own previous Allure `history/` folder before generating the next report, so UI and API trends remain separate

GitHub Pages URLs:

- `https://<owner>.github.io/<repo>/ui/`
- `https://<owner>.github.io/<repo>/api/`

Optional CI variables and secrets:

- Variables: `BASE_URL`, `API_BASE_URL`, `ANALYTICS_IMPORT_URL`
- Secret: `ANALYTICS_API_TOKEN`

## Local vs CI Behavior

Local usage:

- Local runs can rely on default `dev` and `brandA` selection.
- Local runs can override environment, brand, browser, headless mode, workers, timeouts, viewport, and URLs.
- Headed execution is available through `npm run test:headed`.

CI usage:

- UI CI runs can choose `headless=true`; API CI runs use fixed `HEADLESS=true`.
- CI keeps the same provider chain as local runs and does not bypass `environmentProvider`, `accountProvider`, or `frameworkConfigProvider`.
- UI and API workflows are separate so their suites, artifacts, and GitHub Pages destinations do not overwrite each other.

## Public Repository Safety

This repository is safe for public hosting in its current sample form because:

- UI tests use demo credentials from a public training site
- API tests target a public demo API
- no private URLs, API keys, or personal data are required for the sample flows
- workflows do not hardcode secrets
- generated artifacts and local clutter are intended to stay gitignored
- `package.json` is marked `private`

If you adapt this framework to a private system:

- move real credentials out of committed JSON files
- store secrets in GitHub Secrets or local gitignored inputs
- keep non-sensitive environment overrides in GitHub Variables

## Recommended Validation

For framework or TypeScript changes:

```bash
npm run typecheck
npm run lint
```

For UI-impacting changes:

```bash
npm run test:ui
```

For API-impacting changes:

```bash
npm run test:api
```

For broad or unclear impact:

```bash
npx playwright test
```

## Repository Notes

- `README.md` is the single documentation source of truth for local usage, configuration, architecture, reporting, and CI behavior.
- Keep command examples aligned with real npm scripts and provider-supported environment variables.
- If structure or workflows change, update this README in the same change set.
