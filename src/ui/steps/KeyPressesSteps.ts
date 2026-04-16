import { expect, Page, TestInfo, test } from '@playwright/test';
import { TestLogger } from '../../logging/TestLogger';
import { KeyPressesPage } from '../pages/KeyPressesPage';

export class KeyPressesSteps {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly logger: TestLogger;
  private readonly keyPressesPage: KeyPressesPage;

  constructor(page: Page, testInfo: TestInfo, logger: TestLogger) {
    this.page = page;
    this.testInfo = testInfo;
    this.logger = logger;
    this.keyPressesPage = new KeyPressesPage(page);
  }

  async open(): Promise<void> {
    await test.step('Open key presses page', async () => {
      await this.page.goto('/key_presses');
    });
  }

  async pressKey(key: string): Promise<void> {
    await test.step(`Press key ${key}`, async () => {
      await this.keyPressesPage.input.press(key);
    });
  }

  async shouldShowPressedKey(expectedKey: string): Promise<void> {
    await test.step(`Verify pressed key ${expectedKey} is displayed`, async () => {
      await expect(this.keyPressesPage.resultText).toHaveText(`You entered: ${expectedKey}`);
    });
  }
}
