import { test } from '../../../src/fixtures/test-fixtures';
import { JavaScriptAlertsSteps } from '../../../src/ui/steps/JavaScriptAlertsSteps';

test(
  'Should submit text in a prompt and show the echoed value',
  { tag: ['@TMS-1012', '@UI'] },
  async ({ page, logger }, testInfo) => {
    const javaScriptAlertsSteps = new JavaScriptAlertsSteps(page, testInfo, logger);

    await javaScriptAlertsSteps.open();
    await javaScriptAlertsSteps.submitPrompt('Playwright prompt value');
    await javaScriptAlertsSteps.shouldShowResult('You entered: Playwright prompt value');
  }
);
