---
name: playwright-ci-docs
description: Maintain GitHub Actions, commands.txt, README, PROJECT_OVERVIEW, .gitignore, repository hygiene, Allure/Playwright artifacts, GitHub Pages reporting, and copy-paste friendly developer documentation for this Playwright TypeScript framework.
---

This project is intended to be safe, maintainable, and ready for GitHub usage.

CI/CD rules:

- Do not break environment/account/config logic.
- Keep TEST_ENV and TEST_BRAND flow intact.
- Keep BASE_URL and API_BASE_URL override behavior intact.
- Keep BROWSER/PW_BROWSER, HEADLESS/PW_HEADLESS, and WORKERS/PW_WORKERS override behavior intact.
- Use workflow_dispatch for manual workflows where requested.
- Keep UI and API workflows separate when requested.
- Prefer clean, practical workflows over overengineered pipelines.
- Keep artifact upload for debugging.
- Preserve Allure generation and publishing logic where present.
- Set practical job timeouts.
- Keep dependency installation deterministic with `npm ci` in CI.
- Keep Playwright browser installation explicit.

Documentation rules:

- commands.txt must be copy-paste friendly.
- Commands should be Windows PowerShell friendly unless explicitly requested otherwise.
- Explanations should be concise but clear.
- Keep documentation aligned with the actual current project structure and behavior.
- Do not leave outdated commands or old environment names.
- Document CI inputs using the same names as workflow inputs.
- Document environment variables using the same names as the providers accept.

Repository hygiene rules:

- Root .gitignore must exist.
- Ignore generated artifacts, local IDE clutter, logs, reports, and temporary files.
- Do not ignore files required for framework execution.
- Keep project safe for GitHub push/publication.
- Do not hardcode secrets in workflow files or documentation.
- Do not ignore files required to run tests, generate reports, or resolve config.

When updating docs or workflows:

1. Reflect the real current behavior of the project.
2. Keep naming and examples consistent with TEST_ENV/TEST_BRAND and current folder structure.
3. Explain what can be overridden from CI/CLI.
4. Preserve local developer workflow.
5. Run `npm run typecheck` when code or TypeScript config is touched.

Workflow review checklist:

- Manual inputs are mapped into environment variables used by the framework.
- `npm run typecheck` runs before test execution.
- UI workflow runs `npm run test:ui`; API workflow runs `npm run test:api`.
- Reports are uploaded with `if: always()`.
- Allure raw results and generated HTML reports are preserved.
- Secrets are read from GitHub Secrets or Variables, not hardcoded.
- GitHub Pages publishing does not overwrite the other workflow's report path.
