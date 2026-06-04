---
name: playwright-ci-debugger
description: Diagnose and fix GitHub Actions failures, Playwright CI failures, npm run typecheck failures, npm run test:ui failures, npm run test:api failures, npx playwright test failures, Allure/reporting failures, artifact upload failures, GitHub Pages publishing failures, and workflow regressions in this project.
---

Diagnose CI failures from evidence before changing files.

Scope:

- GitHub Actions workflow failures
- `npm run typecheck` failures
- `npm run test:ui` failures
- `npm run test:api` failures
- `npx playwright test` failures
- Allure report generation failures
- Artifact upload or GitHub Pages publication failures

Diagnostic workflow:

1. Identify which command or workflow step failed.
2. Capture the first meaningful error, not only the final exit code.
3. Classify the failure:
   - TypeScript compile error
   - UI test failure
   - API test failure
   - Playwright browser install or runtime issue
   - Config resolution issue
   - Account allocation issue
   - Allure/reporting/artifact issue
   - GitHub Pages publication issue
   - Transient infrastructure issue
4. Read the affected files and the providers involved.
5. Reproduce locally with the narrowest command when feasible.
6. Apply the smallest fix that addresses the root cause.
7. Re-run the narrow command, then the broader affected command.
8. If the failure is transient, explain the evidence and recommend rerun instead of changing code.

Project-specific checks:

- `TEST_ENV` and `TEST_BRAND` map to existing config files.
- `BASE_URL` and `API_BASE_URL` overrides do not bypass providers.
- `BROWSER` and `PW_BROWSER` remain compatible with Playwright projects.
- `HEADLESS`, `PW_HEADLESS`, `WORKERS`, and `PW_WORKERS` parse correctly.
- Account files provide enough default accounts for configured workers.
- Tests do not depend on execution order.
- UI selectors use Playwright locators and avoid arbitrary sleeps.
- API tests use the `request` fixture and API client classes.
- Allure generation runs after tests with available `allure-results`.
- Artifact upload paths match generated folders.
- Publishing UI/API reports uses separate destinations.

Useful local commands:

- `npm run typecheck`
- `npm run test:ui`
- `npm run test:api`
- `npx playwright test --trace on`
- `npm run allure:generate`

GitHub CLI workflow, when credentials are available:

- `gh pr checks <number> --repo <owner>/<repo>`
- `gh run list --branch <branch> --repo <owner>/<repo> --limit 5`
- `gh run view <run-id> --repo <owner>/<repo> --json jobs`
- `gh run view <run-id> --repo <owner>/<repo> --log-failed`

Failure handling:

- TypeScript: fix typings/imports/contracts; do not suppress with `any` unless the local pattern already does so and it is justified.
- UI test: inspect selector, wait condition, fixture setup, account selection, and trace/screenshot artifacts.
- API test: inspect base URL resolution, client endpoint, request body, response shape, and test data factory.
- Browser install/runtime: inspect workflow browser input and Playwright install command.
- Allure/reporting: inspect reporter config, result folder generation, and artifact paths.
- GitHub Pages: inspect token permissions, publish path, and destination directory separation.

Output:

- State the failing command or CI step.
- State the root cause in one sentence.
- List affected files.
- Say whether the issue is code, configuration, data, or transient infrastructure.
- Describe the fix and validation result.

Constraints:

- Do not refactor unrelated code while fixing CI.
- Do not hide failures by weakening assertions or skipping tests.
- Do not hardcode URLs, credentials, or environment-specific values.
- Do not commit or push without explicit user approval.
