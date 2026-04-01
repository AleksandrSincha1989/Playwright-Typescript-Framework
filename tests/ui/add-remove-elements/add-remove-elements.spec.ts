import { test } from '../../../src/fixtures/test-fixtures';
import { AddRemoveElementsSteps } from '../../../src/ui/steps/AddRemoveElementsSteps';

test(
  'Should add multiple dynamic elements and remove a specific one',
  { tag: ['@TMS-1009', '@UI'] },
  async ({ page, logger }, testInfo) => {
    const addRemoveElementsSteps = new AddRemoveElementsSteps(page, testInfo, logger);

    await addRemoveElementsSteps.open();
    await addRemoveElementsSteps.addElements(3);
    await addRemoveElementsSteps.shouldHaveDeleteButtons(3);
    await addRemoveElementsSteps.removeElementAt(1);
    await addRemoveElementsSteps.shouldHaveDeleteButtons(2);
  }
);
