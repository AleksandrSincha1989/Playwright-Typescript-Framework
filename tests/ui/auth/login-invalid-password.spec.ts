import { test } from '../../../src/fixtures/test-fixtures';
import { LoginSteps } from '../../../src/ui/steps/LoginSteps';

test(
  'Should show a clear error when logging in with an invalid password',
  { tag: ['@TMS-1004', '@UI', '@negative'] },
  async ({ page, logger, assignedAccount, getNamedAccount }, testInfo) => {
    const loginSteps = new LoginSteps(page, testInfo, logger, assignedAccount, getNamedAccount);

    await loginSteps.open();
    await loginSteps.loginAs(assignedAccount.username, 'WrongPassword!');
    await loginSteps.shouldSeeInvalidPasswordMessage();
    await loginSteps.shouldStayOnLoginPage();
  }
);
