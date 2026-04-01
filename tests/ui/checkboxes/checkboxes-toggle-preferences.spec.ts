import { test } from '../../../src/fixtures/test-fixtures';
import { CheckboxesSteps } from '../../../src/ui/steps/CheckboxesSteps';

test(
  'Should update checkbox states to match a chosen preference',
  { tag: ['@TMS-1006', '@UI'] },
  async ({ page, logger }, testInfo) => {
    const checkboxesSteps = new CheckboxesSteps(page, testInfo, logger);

    await checkboxesSteps.open();
    await checkboxesSteps.shouldHaveDefaultStates();
    await checkboxesSteps.toggleFirstCheckbox();
    await checkboxesSteps.toggleSecondCheckboxOff();
    await checkboxesSteps.shouldReflectUpdatedStates();
  }
);
