import { test } from '../../../src/fixtures/test-fixtures';
import { LoginSteps } from '../../../src/ui/steps/LoginSteps';

test(
  'Should show a clear error when logging in with an invalid username',
  { tag: ['@TMS-1003', '@UI', '@negative'] },
  async ({ page, logger, assignedAccount, getNamedAccount }, testInfo) => {
    const loginSteps = new LoginSteps(page, testInfo, logger, assignedAccount, getNamedAccount);

    await loginSteps.open();
    await loginSteps.loginAs('invalid-user', assignedAccount.password);
    await loginSteps.shouldSeeInvalidUsernameMessage();
    await loginSteps.shouldStayOnLoginPage();
  }
);
