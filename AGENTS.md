# AGENTS.md

## Project Overview

This is a Playwright TypeScript test automation framework with:

- UI and API test layers
- Config-driven architecture (environment + brand)
- AccountProvider with worker-safe allocation
- EnvironmentProvider for environment resolution
- FrameworkConfig as a single entry point
- Support for parallel execution
- CI/CD via GitHub Actions
- Allure and Playwright reporting

---

## Modes

The agent must infer mode based on user request:

- review → pull request / code review
- development → feature implementation
- refactoring → code improvement
- test-generation → writing new tests
- debugging → fixing failing tests or runtime issues

---

# =========================
# REVIEW MODE
# =========================

## Review Guidelines

- Prioritize:
    - behavioral bugs
    - regressions
    - flaky Playwright interactions
    - broken configuration

- Deprioritize:
    - formatting
    - stylistic preferences

- Treat as HIGH PRIORITY:
    - failing `npm run typecheck`
    - failing `npm run test:ui`
    - failing `npm run test:api`
    - failing `npx playwright test`

- Always check:
    - missing `await`
    - async race conditions
    - shared mutable state
    - incorrect fixtures usage
    - unstable selectors

- Validate environment logic:
    - TEST_ENV
    - TEST_BRAND
    - BASE_URL
    - API_BASE_URL
    - PW_BROWSER

- Flag immediately:
    - secrets in code
    - credentials
    - unsafe logging

- Prefer:
    - minimal fixes
    - no architectural changes

## Validation

- Run:
    - `npm run typecheck`
    - `npm run test:ui`
    - `npm run test:api`

- If unclear:
    - `npx playwright test`

---

# =========================
# DEVELOPMENT MODE
# =========================

- Follow existing architecture strictly
- Reuse existing providers:
    - environmentProvider
    - accountProvider
    - frameworkConfigProvider

- All new logic must be:
    - environment-aware
    - brand-aware

- DO NOT hardcode:
    - URLs
    - credentials
    - API endpoints

- Prefer:
    - simple solutions
    - existing abstractions

---

# =========================
# REFACTORING MODE
# =========================

- Goals:
    - improve readability
    - reduce duplication
    - simplify logic

- Apply:
    - DRY
    - KISS
    - SOLID (only where justified)

- DO NOT:
    - change public contracts
    - break providers logic
    - introduce unnecessary abstractions

- Prefer:
    - removing code over adding complexity

---

# =========================
# TEST GENERATION MODE
# =========================

## General

- One test per file
- Test name:
    - must be capitalized
    - must NOT include tags in title

- Use tags:
    - @TMS-XXXX
    - @UI
    - @API

---

## UI Tests

- Use Page Object pattern:
    - ONLY locators in PageObjects
    - NO assertions in PageObjects

- Use Steps layer:
    - business logic
    - assertions allowed

- Selectors must be:
    - stable
    - specific
    - resistant to UI changes

---

## API Tests

- Use Playwright `request` fixture
- Use API client classes
- DO NOT hardcode base URLs
- Always use config-driven endpoints

---

## Test Data

- Prefer factories (faker)
- Allow overrides for deterministic behavior
- Avoid hardcoded data unless necessary

---

# =========================
# DEBUGGING MODE
# =========================

- Focus on:
    - root cause, not symptoms
    - reproducibility

- Always check:
    - timing issues
    - awaits
    - network delays
    - parallel execution conflicts

- Validate:
    - selectors
    - environment config
    - account allocation

---

# =========================
# ARCHITECTURE RULES
# =========================

## Critical Constraints

DO NOT:

- Break accountProvider logic (worker-based allocation)
- Break environmentProvider contract
- Break frameworkConfig structure
- Introduce shared mutable state across workers
- Mix UI and API layers
- Hardcode environment-specific values

---

## Configuration Rules

- frameworkConfig is the single entry point
- environmentProvider resolves environment + brand
- accountProvider manages:
    - default pool (for workers)
    - named accounts

- Config must support:
    - CLI overrides
    - CI/CD variables

---

# =========================
# LOGGING & REPORTING
# =========================

- Screenshots:
    - ONLY on failure

- Logs:
    - must be per-test
    - must support parallel execution

- Attach:
    - logs
    - screenshots
    - artifacts

---

# =========================
# CI/CD RULES
# =========================

- Must support:
    - env selection
    - brand selection
    - browser override
    - workers override

- Do NOT break:
    - GitHub Actions workflows
    - commands.txt

- Ensure:
    - tests run headless in CI
    - reports are generated

---

# =========================
# CODE STYLE
# =========================

- Prefer:
    - simple functions over abstractions
    - readability over cleverness

- Avoid:
    - duplication
    - overengineering
    - unnecessary generics

---

# =========================
# ENGINEERING PRINCIPLES
# =========================

All code changes must follow these principles:

## DRY (Don't Repeat Yourself)

- Avoid code duplication
- Extract reusable logic where appropriate
- Do not duplicate selectors, API calls, or config logic

---

## KISS (Keep It Simple, Stupid)

- Prefer simple solutions over complex ones
- Avoid unnecessary abstractions
- Do not introduce layers without clear benefit

---

## YAGNI (You Aren't Gonna Need It)

- Do NOT implement features that are not required right now
- Avoid speculative abstractions or premature generalization
- Do not add flexibility unless it is actually needed

---

## SOLID (apply pragmatically)

- Follow SOLID where it improves maintainability
- Do not overengineer just to satisfy SOLID formally

Key expectations:

- Single Responsibility:
    - PageObjects → locators only
    - Steps → business logic
    - Providers → config resolution

- Open/Closed:
    - Prefer extension over modification when safe

- Dependency Inversion:
    - Avoid tight coupling between layers

---

## Clean Code

- Code must be:
    - readable
    - predictable
    - easy to maintain

- Use:
    - meaningful names
    - small functions
    - clear structure

- Avoid:
    - magic values
    - hidden side effects
    - deeply nested logic

---

## Final Rule

Prefer:

- clarity over cleverness
- simplicity over flexibility
- stability over abstraction
- 
# =========================
# FINAL PRINCIPLE
# =========================

When in doubt:

- DO NOT break existing logic
- DO NOT introduce new patterns
- DO NOT overengineer

Prefer:

- stability
- predictability
- maintainability