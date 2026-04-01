import { expect, Page, TestInfo, test } from '@playwright/test';
import { TestLogger } from '../../logging/TestLogger';
import { MainPage } from '../pages/MainPage';

export class MainPageSteps {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly logger: TestLogger;
  private readonly mainPage: MainPage;

  constructor(page: Page, testInfo: TestInfo, logger: TestLogger) {
    this.page = page;
    this.testInfo = testInfo;
    this.logger = logger;
    this.mainPage = new MainPage(page);
  }

  async shouldBeOpened(): Promise<void> {
    await test.step('Verify secure area page is opened', async () => {
      await expect(this.page).toHaveURL(/\/secure$/);
      await expect(this.mainPage.heading).toBeVisible();
      await this.logger.log('Secure area page is open', { url: this.page.url() });
    });
  }

  async shouldSeeSecureAreaHeading(): Promise<void> {
    await test.step('Verify secure area heading', async () => {
      await expect(this.mainPage.heading).toHaveText('Secure Area');
      await this.logger.log('Secure area heading verified');
    });
  }

  async shouldSeeLogoutButton(): Promise<void> {
    await test.step('Verify logout button is visible', async () => {
      await expect(this.mainPage.logoutButton).toBeVisible();
      await expect(this.mainPage.logoutButton).toHaveText('Logout');
      await this.logger.log('Logout button verified');
    });
  }

  async shouldSeeSecureAreaMessage(): Promise<void> {
    await test.step('Verify secure area flash message', async () => {
      await expect(this.mainPage.flashMessage).toContainText('You logged into a secure area!');
      await this.logger.log('Secure area message verified');
    });
  }

  async logout(): Promise<void> {
    await test.step('Log out from the secure area', async () => {
      await this.mainPage.logoutButton.click();
      await this.logger.log('Logout clicked');
    });
  }

  async shouldSeeLogoutMessage(): Promise<void> {
    await test.step('Verify logout success message', async () => {
      await expect(this.mainPage.flashMessage).toContainText('You logged out of the secure area!');
      await this.logger.log('Logout message verified');
    });
  }
}
