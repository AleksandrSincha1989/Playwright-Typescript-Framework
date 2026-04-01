import { defineConfig } from '@playwright/test';
import { frameworkConfig } from './src/config/frameworkConfigProvider';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: frameworkConfig.execution.workers,
  timeout: 30_000,
  expect: {
    timeout: frameworkConfig.execution.defaultTimeoutMs
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }]
  ],
  use: {
    baseURL: frameworkConfig.environment.baseUrl,
    browserName: frameworkConfig.execution.browser,
    headless: frameworkConfig.execution.headless,
    viewport: frameworkConfig.execution.viewport,
    actionTimeout: frameworkConfig.execution.defaultTimeoutMs,
    navigationTimeout: frameworkConfig.execution.defaultTimeoutMs,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'off',
    launchOptions: {
      slowMo: frameworkConfig.execution.slowMoMs
    }
  }
});
