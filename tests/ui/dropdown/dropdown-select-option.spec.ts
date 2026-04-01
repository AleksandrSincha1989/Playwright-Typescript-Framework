import { test } from '../../../src/fixtures/test-fixtures';
import { DropdownSteps } from '../../../src/ui/steps/DropdownSteps';

test(
  'Should select a value from the dropdown and apply the choice',
  { tag: ['@TMS-1007', '@UI'] },
  async ({ page, logger }, testInfo) => {
    const dropdownSteps = new DropdownSteps(page, testInfo, logger);

    await dropdownSteps.open();
    await dropdownSteps.selectOption('Option 2');
    await dropdownSteps.shouldHaveSelectedOption('Option 2');
  }
);
