---
name: playwright-test-generation
description: Use when generating or extending UI/API tests in this Playwright TypeScript framework.
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

UI test rules:

- Use Page Objects for selectors only.
- Use UI Steps for actions + assertions.
- Do not put complex UI logic directly in test files.
- Prefer meaningful end-to-end scenarios over trivial smoke checks.
- Avoid brittle tests and poor synchronization.
- Do not use sleeps when Playwright-native waiting is sufficient.

API test rules:

- Use Playwright APIRequestContext.
- Use src/api/client for low-level HTTP calls.
- Use src/api/steps for API workflows/assertions.
- Keep models as TypeScript types/interfaces, not classes, unless explicitly needed.
- Response models are usually more useful than request models.
- Do not hardcode API base URLs in clients; use framework config.

Test design rules:

- Favor business-relevant or user-relevant validation.
- Avoid duplicate tests with tiny variations.
- Use generated data via factories if Faker is used.
- Do not call Faker inline everywhere in tests.
- Keep new abstractions minimal and justified.

Tagging rules:

- Preserve existing tags.
- Add @API to API tests.
- Add domain tags where useful, such as @auth, @mainpage, @smoke.
- Keep tag naming consistent.

When adding tests:

1. Reuse existing Steps and Page Objects where possible.
2. Create new files only when needed.
3. Keep file and class naming clear.
4. Ensure imports are correct after changes.
5. Do not break existing test grouping and folder conventions.