import { expect, Page, TestInfo, test } from '@playwright/test';
import { type TestAccount } from '../../config/accountProvider';
import { TestLogger } from '../../logging/TestLogger';
import { LoginPage } from '../pages/LoginPage';

export class LoginSteps {
  private readonly assignedAccount: TestAccount;
  private readonly getNamedAccount: (name: string) => TestAccount;
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly logger: TestLogger;
  private readonly loginPage: LoginPage;

  constructor(
    page: Page,
    testInfo: TestInfo,
    logger: TestLogger,
    assignedAccount: TestAccount,
    getNamedAccount: (name: string) => TestAccount
  ) {
    this.page = page;
    this.testInfo = testInfo;
    this.logger = logger;
    this.assignedAccount = assignedAccount;
    this.getNamedAccount = getNamedAccount;
    this.loginPage = new LoginPage(page);
  }

  async open(): Promise<void> {
    await test.step('Open login page', async () => {
      await this.logger.log('Opening login page');
      await this.page.goto('/login');
    });
  }

  async loginAs(username: string, password: string): Promise<void> {
    await test.step(`Log in as ${username}`, async () => {
      await this.logger.debug('Submitting credentials', {
        username,
        passwordLength: password.length
      });
      await this.loginPage.usernameInput.fill(username);
      await this.loginPage.passwordInput.fill(password);
      await this.loginPage.loginButton.click();
    });
  }

  async loginWithDemoAccount(): Promise<void> {
    await test.step('Log in with the demo account', async () => {
      const demoAccount = this.getNamedAccount('demo');

      await this.logger.log('Using demo account', { username: demoAccount.username });
      await this.loginAs(demoAccount.username, demoAccount.password);
    });
  }

  async loginAsAssignedAccount(): Promise<void> {
    await test.step('Log in as the assigned worker account', async () => {
      await this.logger.log('Using assigned worker account', {
        username: this.assignedAccount.username
      });
      await this.loginAs(this.assignedAccount.username, this.assignedAccount.password);
    });
  }

  async loginAsNamedAccount(name: string): Promise<void> {
    await test.step(`Log in as named account "${name}"`, async () => {
      const namedAccount = this.getNamedAccount(name);
      await this.logger.log('Using named account', {
        name,
        username: namedAccount.username
      });
      await this.loginAs(namedAccount.username, namedAccount.password);
    });
  }

  async shouldSeeSuccessfulLoginMessage(): Promise<void> {
    await test.step('Verify successful login message is displayed', async () => {
      await expect(this.loginPage.flashMessage).toContainText('You logged into a secure area!');
    });
  }

  async shouldSeeInvalidUsernameMessage(): Promise<void> {
    await test.step('Verify invalid username message is displayed', async () => {
      await expect(this.loginPage.flashMessage).toContainText('Your username is invalid!');
      await expect(this.loginPage.heading).toHaveText('Login Page');
    });
  }

  async shouldSeeInvalidPasswordMessage(): Promise<void> {
    await test.step('Verify invalid password message is displayed', async () => {
      await expect(this.loginPage.flashMessage).toContainText('Your password is invalid!');
      await expect(this.loginPage.heading).toHaveText('Login Page');
    });
  }

  async shouldStayOnLoginPage(): Promise<void> {
    await test.step('Verify user remains on the login page', async () => {
      await expect(this.page).toHaveURL(/\/login$/);
      await expect(this.loginPage.loginButton).toBeVisible();
    });
  }
}
