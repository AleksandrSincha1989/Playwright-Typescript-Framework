---
name: playwright-ci-docs
description: Use when changing GitHub Actions, commands.txt, PROJECT_OVERVIEW, README, .gitignore, or repository hygiene.
---

This project is intended to be safe, maintainable, and ready for GitHub usage.

CI/CD rules:

- Do not break environment/account/config logic.
- Keep TEST_ENV and TEST_BRAND flow intact.
- Use workflow_dispatch for manual workflows where requested.
- Keep UI and API workflows separate when requested.
- Prefer clean, practical workflows over overengineered pipelines.
- Keep artifact upload for debugging.
- Preserve Allure generation and publishing logic where present.

Documentation rules:

- commands.txt must be copy-paste friendly.
- Commands should be Windows PowerShell friendly unless explicitly requested otherwise.
- Explanations should be concise but clear.
- Keep documentation aligned with the actual current project structure and behavior.
- Do not leave outdated commands or old environment names.

Repository hygiene rules:

- Root .gitignore must exist.
- Ignore generated artifacts, local IDE clutter, logs, reports, and temporary files.
- Do not ignore files required for framework execution.
- Keep project safe for GitHub push/publication.
- Do not hardcode secrets in workflow files or documentation.

When updating docs or workflows:

1. Reflect the real current behavior of the project.
2. Keep naming and examples consistent with TEST_ENV/TEST_BRAND and current folder structure.
3. Explain what can be overridden from CI/CLI.
4. Preserve local developer workflow.