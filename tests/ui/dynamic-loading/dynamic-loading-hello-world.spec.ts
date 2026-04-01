import { test } from '../../../src/fixtures/test-fixtures';
import { DynamicLoadingSteps } from '../../../src/ui/steps/DynamicLoadingSteps';

test(
  'Should show loaded content only after the async action completes',
  { tag: ['@TMS-1008', '@UI'] },
  async ({ page, logger }, testInfo) => {
    const dynamicLoadingSteps = new DynamicLoadingSteps(page, testInfo, logger);

    await dynamicLoadingSteps.openExampleTwo();
    await dynamicLoadingSteps.startLoading();
    await dynamicLoadingSteps.shouldRevealHelloWorldMessage();
  }
);
