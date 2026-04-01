import { test } from '../../../src/fixtures/test-fixtures';
import { KeyPressesSteps } from '../../../src/ui/steps/KeyPressesSteps';

test(
  'Should show immediate feedback for the pressed keyboard key',
  { tag: ['@TMS-1013', '@UI'] },
  async ({ page, logger }, testInfo) => {
    const keyPressesSteps = new KeyPressesSteps(page, testInfo, logger);

    await keyPressesSteps.open();
    await keyPressesSteps.pressKey('A');
    await keyPressesSteps.shouldShowPressedKey('A');
  }
);
