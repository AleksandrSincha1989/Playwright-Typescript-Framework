---
name: playwright-pr-review
description: Review pull requests, local diffs, staged changes, framework refactors, test additions, CI changes, and repository hygiene changes in this Playwright TypeScript framework. Use for code review, PR review, audit, regression risk assessment, security review, and pre-merge validation.
---

Review changes as a framework-aware QA automation engineer.

Scope:

- Pull request review
- Local diff review
- Review before merge
- Security and configuration audit
- Regression risk assessment

Review priorities:

- Failing validation commands
- Behavioral bugs and test regressions
- Missing `await`, unsafe async flow, and Playwright races
- Shared mutable state across workers
- Broken fixtures or incorrect fixture scope
- Flaky selectors and brittle Playwright interactions
- Broken environment, brand, browser, headless, worker, or URL override logic
- Secrets, credentials, private endpoints, or unsafe logging
- CI/reporting changes that drop artifacts or bypass providers

Project contracts to protect:

- Page objects contain locators and locator-building logic only.
- Steps contain workflows, actions, and assertions.
- Tests stay thin and orchestrate steps.
- API clients use framework configuration and do not hardcode base URLs.
- `frameworkConfigProvider` remains the single runtime entry point.
- `environmentProvider` keeps environment and brand resolution.
- `accountProvider` keeps worker-safe default account allocation and named accounts.

Review workflow:

1. Identify the review target: PR, local diff, staged diff, or specific files.
2. Read the changed files and nearby context, not just the diff.
3. Check whether each change preserves UI/API layer boundaries.
4. Check configuration flow for `TEST_ENV`, `TEST_BRAND`, `BASE_URL`,
   `API_BASE_URL`, `BROWSER`, `PW_BROWSER`, `HEADLESS`, `PW_HEADLESS`,
   `WORKERS`, and `PW_WORKERS`.
5. Check selectors for stability and Playwright-native waiting.
6. Check reports, screenshots, traces, logs, and artifacts are preserved.
7. Run validation commands when feasible.

Validation:

- `npm run typecheck`
- `npm run test:ui` for UI changes
- `npm run test:api` for API changes
- `npx playwright test` for broad or unclear changes

Output:

- Lead with findings ordered by severity.
- Include exact file and line references.
- Explain the likely behavioral impact.
- Keep style-only comments out unless they hide a real maintainability risk.
- If no issues are found, say so and list any tests that were not run.
- Include open questions only after findings.
- Keep summaries brief and secondary.

PR hygiene:

- Do not mention automation tooling in PR comments, titles, or bodies.
- Do not include change statistics.
- Keep review comments specific and actionable.
- Do not create commits, push, or submit PR reviews unless the user asks.

Severity guide:

- Critical: bug, security issue, broken provider/config contract, data leak, failing required validation.
- Important: flaky behavior, missed awaits, unstable selectors, hidden shared state, lost artifacts.
- Suggestion: maintainability improvement that does not block behavior.
