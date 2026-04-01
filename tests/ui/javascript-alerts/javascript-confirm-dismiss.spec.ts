import { test } from '../../../src/fixtures/test-fixtures';
import { JavaScriptAlertsSteps } from '../../../src/ui/steps/JavaScriptAlertsSteps';

test(
  'Should cancel a destructive action and show the cancelled result',
  { tag: ['@TMS-1011', '@UI', '@negative'] },
  async ({ page, logger }, testInfo) => {
    const javaScriptAlertsSteps = new JavaScriptAlertsSteps(page, testInfo, logger);

    await javaScriptAlertsSteps.open();
    await javaScriptAlertsSteps.dismissConfirm();
    await javaScriptAlertsSteps.shouldShowResult('You clicked: Cancel');
  }
);
