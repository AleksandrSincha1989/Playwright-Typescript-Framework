import { test } from '../../../src/fixtures/test-fixtures';
import { JavaScriptAlertsSteps } from '../../../src/ui/steps/JavaScriptAlertsSteps';

test(
  'Should confirm a destructive action and show the accepted result',
  { tag: ['@TMS-1010', '@UI'] },
  async ({ page, logger }, testInfo) => {
    const javaScriptAlertsSteps = new JavaScriptAlertsSteps(page, testInfo, logger);

    await javaScriptAlertsSteps.open();
    await javaScriptAlertsSteps.acceptConfirm();
    await javaScriptAlertsSteps.shouldShowResult('You clicked: Ok');
  }
);
