import { test } from '../../../src/fixtures/test-fixtures';
import { LoginSteps } from '../../../src/ui/steps/LoginSteps';
import { MainPageSteps } from '../../../src/ui/steps/MainPageSteps';

test(
  'Should log out after a successful login and show a confirmation message',
  { tag: ['@TMS-1005', '@UI'] },
  async ({ page, logger, assignedAccount, getNamedAccount }, testInfo) => {
    const loginSteps = new LoginSteps(page, testInfo, logger, assignedAccount, getNamedAccount);
    const mainPageSteps = new MainPageSteps(page, testInfo, logger);

    await loginSteps.open();
    await loginSteps.loginAsAssignedAccount();
    await mainPageSteps.shouldBeOpened();
    await mainPageSteps.logout();
    await loginSteps.shouldStayOnLoginPage();
    await mainPageSteps.shouldSeeLogoutMessage();
  }
);
