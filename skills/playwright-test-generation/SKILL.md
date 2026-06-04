---
name: playwright-test-generation
description: Generate or extend UI and API tests in this Playwright TypeScript framework, including page objects, steps, API clients, API models, factories, tags, TMS metadata, and validation commands. Use for new test scenarios, test coverage gaps, test refactors, and framework-consistent Playwright test additions.
---

Generate tests in the style of this framework.

General rules:

- One file = one test.
- Test names must be human-readable and start with capitalized style like:
  "Should ..."
- Do not put tags in the title.
- Apply Playwright tags using metadata, not inside the test title.
- Every new test must have a unique @TMS-xxxx tag if requested.
- Keep tests thin; use Steps classes for actions/assertions/workflows.
- Add only the abstractions needed for the requested scenario.
- Prefer a business-relevant assertion over a superficial smoke check.
- Keep tests independent and parallel-safe.

UI test rules:

- Use Page Objects for selectors only.
- Use UI Steps for actions + assertions.
- Do not put complex UI logic directly in test files.
- Prefer meaningful end-to-end scenarios over trivial smoke checks.
- Avoid brittle tests and poor synchronization.
- Do not use sleeps; use Playwright-native locator/action/assertion waiting.
- Prefer `getByRole`, `getByLabel`, `getByPlaceholder`, and stable test IDs when available.
- Use text selectors only when the text is a stable user-facing contract.
- Avoid CSS class selectors and positional selectors unless no stable alternative exists.

API test rules:

- Use Playwright APIRequestContext.
- Use src/api/client for low-level HTTP calls.
- Use src/api/steps for API workflows/assertions.
- Keep models as TypeScript types/interfaces, not classes, unless explicitly needed.
- Response models are usually more useful than request models.
- Do not hardcode API base URLs in clients; use framework config.
- Keep endpoint paths centralized in the relevant API client when practical.
- Validate status, shape, and behavior; avoid asserting the whole response when only key fields matter.

Test design rules:

- Favor business-relevant or user-relevant validation.
- Avoid duplicate tests with tiny variations.
- Use generated data via factories if Faker is used.
- Do not call Faker inline everywhere in tests.
- Keep new abstractions minimal and justified.
- Use deterministic overrides for generated data when assertions depend on exact values.
- Do not make tests order-dependent or dependent on shared mutable state.

Tagging rules:

- Preserve existing tags.
- Add @API to API tests.
- Add @UI to UI tests.
- Add domain tags where useful, such as @auth, @mainpage, @smoke.
- Keep tag naming consistent.

When adding tests:

1. Reuse existing Steps and Page Objects where possible.
2. Create new files only when needed.
3. Keep file and class naming clear.
4. Ensure imports are correct after changes.
5. Do not break existing test grouping and folder conventions.
6. Run `npm run typecheck`.
7. Run `npm run test:ui` or `npm run test:api` when feasible.

Expected file responsibilities:

- `src/ui/pages/*Page.ts`: locators and simple locator helpers only.
- `src/ui/steps/*Steps.ts`: UI workflows, Playwright actions, and assertions.
- `src/api/client/*Client.ts`: low-level request methods.
- `src/api/steps/*Steps.ts`: API workflows and assertions.
- `src/api/models/*.ts`: request/response types.
- `src/common/factories/*Factory.ts`: generated test data with overrides.
- `tests/ui/**.spec.ts` and `tests/api/**.spec.ts`: thin orchestration.
