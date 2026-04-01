import { expect, Page, TestInfo, test } from '@playwright/test';
import { TestLogger } from '../../logging/TestLogger';
import { DynamicLoadingPage } from '../pages/DynamicLoadingPage';

export class DynamicLoadingSteps {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly logger: TestLogger;
  private readonly dynamicLoadingPage: DynamicLoadingPage;

  constructor(page: Page, testInfo: TestInfo, logger: TestLogger) {
    this.page = page;
    this.testInfo = testInfo;
    this.logger = logger;
    this.dynamicLoadingPage = new DynamicLoadingPage(page);
  }

  async openExampleTwo(): Promise<void> {
    await test.step('Open dynamic loading example 2', async () => {
      await this.page.goto('/dynamic_loading/2');
      await this.logger.log('Opened dynamic loading example 2');
    });
  }

  async startLoading(): Promise<void> {
    await test.step('Start dynamic loading', async () => {
      await this.dynamicLoadingPage.startButton.click();
      await this.logger.log('Dynamic loading started');
    });
  }

  async shouldRevealHelloWorldMessage(): Promise<void> {
    await test.step('Verify Hello World appears after loading', async () => {
      await expect(this.dynamicLoadingPage.loadingIndicator).toBeHidden();
      await expect(this.dynamicLoadingPage.finishText).toHaveText('Hello World!');
      await this.logger.log('Dynamic loading result verified');
    });
  }
}
