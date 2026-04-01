import { test } from '../../../src/fixtures/test-fixtures';
import { LoginSteps } from '../../../src/ui/steps/LoginSteps';
import { MainPageSteps } from '../../../src/ui/steps/MainPageSteps';

test(
  'Should display the secure area page after login with the assigned worker account',
  { tag: ['@TMS-1002','@UI']},
  async ({ page, logger, assignedAccount, getNamedAccount }, testInfo) => {
    const loginSteps = new LoginSteps(page, testInfo, logger, assignedAccount, getNamedAccount);
    const mainPageSteps = new MainPageSteps(page, testInfo, logger);
    await loginSteps.open();
    await loginSteps.loginAsAssignedAccount();
    await mainPageSteps.shouldBeOpened();
    await mainPageSteps.shouldSeeSecureAreaHeading();
    await mainPageSteps.shouldSeeLogoutButton();
    await mainPageSteps.shouldSeeSecureAreaMessage();
  }
);
