import { expect, Page, TestInfo, test } from '@playwright/test';
import { TestLogger } from '../../logging/TestLogger';
import { JavaScriptAlertsPage } from '../pages/JavaScriptAlertsPage';

export class JavaScriptAlertsSteps {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly logger: TestLogger;
  private readonly javaScriptAlertsPage: JavaScriptAlertsPage;

  constructor(page: Page, testInfo: TestInfo, logger: TestLogger) {
    this.page = page;
    this.testInfo = testInfo;
    this.logger = logger;
    this.javaScriptAlertsPage = new JavaScriptAlertsPage(page);
  }

  async open(): Promise<void> {
    await test.step('Open JavaScript alerts page', async () => {
      await this.page.goto('/javascript_alerts');
      await this.logger.log('Opened JavaScript alerts page');
    });
  }

  async acceptConfirm(): Promise<void> {
    await test.step('Accept the JavaScript confirm dialog', async () => {
      this.page.once('dialog', async (dialog) => {
        await dialog.accept();
      });
      await this.javaScriptAlertsPage.jsConfirmButton.click();
      await this.logger.log('JavaScript confirm accepted');
    });
  }

  async dismissConfirm(): Promise<void> {
    await test.step('Dismiss the JavaScript confirm dialog', async () => {
      this.page.once('dialog', async (dialog) => {
        await dialog.dismiss();
      });
      await this.javaScriptAlertsPage.jsConfirmButton.click();
      await this.logger.log('JavaScript confirm dismissed');
    });
  }

  async submitPrompt(text: string): Promise<void> {
    await test.step(`Submit the JavaScript prompt with "${text}"`, async () => {
      this.page.once('dialog', async (dialog) => {
        await dialog.accept(text);
      });
      await this.javaScriptAlertsPage.jsPromptButton.click();
      await this.logger.log('JavaScript prompt submitted', { text });
    });
  }

  async shouldShowResult(text: string): Promise<void> {
    await test.step(`Verify JavaScript result contains "${text}"`, async () => {
      await expect(this.javaScriptAlertsPage.resultText).toContainText(text);
      await this.logger.log('JavaScript result verified', { text });
    });
  }
}
