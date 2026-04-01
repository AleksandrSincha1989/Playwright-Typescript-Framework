import { test } from '../../../src/fixtures/test-fixtures';
import { LoginSteps } from '../../../src/ui/steps/LoginSteps';

test(
  'Should log in with the assigned worker account',
  { tag: ['@TMS-1001','@UI']},
  async ({ page, logger, assignedAccount, getNamedAccount }, testInfo) => {
  const loginSteps = new LoginSteps(page, testInfo, logger, assignedAccount, getNamedAccount);
  await loginSteps.open();
  await loginSteps.loginAsAssignedAccount();
  await loginSteps.shouldSeeSuccessfulLoginMessage();
  }
);
