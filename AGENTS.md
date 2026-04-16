## Review guidelines

- Prioritize real behavioral bugs, test regressions, flaky Playwright interactions, and broken configuration over style-only issues.
- Treat failures in `npm run typecheck`, `npm run test:ui`, `npm run test:api`, or `npx playwright test` as high-priority review findings when a change can cause them.
- Check for missing `await`, incorrect async flows, unsafe shared state, and race conditions in fixtures, page objects, and tests.
- Verify selector changes are stable and specific enough to avoid flaky UI tests.
- Verify `TEST_ENV`, `TEST_BRAND`, `BASE_URL`, `API_BASE_URL`, `PW_BROWSER`, and related Playwright overrides still behave correctly.
- Flag committed secrets, private credentials, or unsafe logging of tokens and sensitive test data as high priority.
- Prefer minimal, targeted fixes that preserve the existing framework structure and script names.

## Validation

- Run `npm run typecheck` for TypeScript-impacting changes.
- Run `npm run test:ui` for UI test changes when feasible.
- Run `npm run test:api` for API test changes when feasible.
- If scope is unclear, use `npx playwright test` to validate the affected area.
