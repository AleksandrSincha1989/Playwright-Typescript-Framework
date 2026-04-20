---
name: playwright-framework-guard
description: Guard a Playwright + TypeScript test framework against behavioral regressions during reviews, refactors, config changes, folder moves, flaky-test fixes, and architectural updates. Use when Codex needs to review or change Playwright framework code involving page objects, steps, fixtures, selectors, environment/config providers, test layout, browser overrides, or validation commands such as npm run typecheck, npm run test:ui, npm run test:api, and npx playwright test.
---

Protect the framework's existing behavior before optimizing or restructuring it.

Use these operating rules:

- Prioritize behavioral bugs, flaky interactions, broken selectors, async mistakes, unsafe shared state, config regressions, and broken validation over style-only issues.
- Preserve the existing framework structure unless the user explicitly asks for a structural redesign.
- Prefer the smallest safe change that keeps current scripts, configuration flow, and responsibilities intact.

Enforce the architecture:

- Keep page objects focused on selectors and locator-building logic.
- Keep steps focused on reusable actions, assertions, and workflows.
- Keep tests thin; they should orchestrate steps rather than absorb framework logic.
- Keep UI and API concerns separated by structure and responsibilities.
- Do not add a separate assertions layer unless the user explicitly requests it.

Assume this project structure unless current files prove otherwise:

- `src/ui/pages`: UI page objects
- `src/ui/steps`: UI workflows and assertions
- `src/api/client`: low-level API request layer
- `src/api/steps`: API workflows and assertions
- `src/api/models`: request and response types where useful
- `config/`: environment and account configuration
- `tests/ui`: UI tests
- `tests/api`: API tests

Protect configuration invariants:

- Do not break `environmentProvider`, `accountProvider`, or `frameworkConfigProvider`.
- Keep `TEST_ENV`, `TEST_BRAND`, `BASE_URL`, `API_BASE_URL`, `PW_BROWSER`, and related overrides working as before unless the task explicitly changes that contract.
- Do not hardcode URLs, accounts, or environment-specific data in test code.
- Treat configuration files and providers as the source of truth.
- Keep direct `process.env` access centralized in the framework config layer.

Protect the account model:

- Preserve deterministic worker-safe allocation.
- Keep `default` accounts mapped to worker-pool behavior.
- Keep `named` accounts explicitly addressable.
- Do not introduce mutable shared pools, ad hoc reservation logic, or hidden cross-test state.

Review and change code with these checks:

- Look for missing `await`, broken async flows, fixture races, and shared mutable state.
- Treat selector changes as risky; favor stable, specific locators over brittle text or index-based matches.
- Preserve tags, TMS tags, Allure reporting, logging, screenshots on failure, and trace-on-first-retry behavior.
- Prefer a single source of truth for runtime values and related types.
- Reduce duplication, but do not over-abstract or add wrappers without clear payoff.

Before making non-trivial changes:

1. Identify the exact files and contracts affected.
2. State which behaviors must remain unchanged.
3. Implement the smallest safe change.
4. Re-check imports, typings, fixture scope, and runtime assumptions.
5. Validate the affected area.

Use this validation guidance:

- Run `npm run typecheck` for TypeScript-impacting changes.
- Run `npm run test:ui` for UI test changes when feasible.
- Run `npm run test:api` for API test changes when feasible.
- Use `npx playwright test` when the affected scope is broader or unclear.
- Treat failures in these commands as high-priority findings when the change could have caused them.

When asked for a review, lead with concrete findings ordered by severity, with file references and the likely behavioral impact.
