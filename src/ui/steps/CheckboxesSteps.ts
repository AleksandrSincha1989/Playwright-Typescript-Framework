import { expect, Page, TestInfo, test } from '@playwright/test';
import { TestLogger } from '../../logging/TestLogger';
import { CheckboxesPage } from '../pages/CheckboxesPage';

export class CheckboxesSteps {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly logger: TestLogger;
  private readonly checkboxesPage: CheckboxesPage;

  constructor(page: Page, testInfo: TestInfo, logger: TestLogger) {
    this.page = page;
    this.testInfo = testInfo;
    this.logger = logger;
    this.checkboxesPage = new CheckboxesPage(page);
  }

  async open(): Promise<void> {
    await test.step('Open checkboxes page', async () => {
      await this.page.goto('/checkboxes');
    });
  }

  async shouldHaveDefaultStates(): Promise<void> {
    await test.step('Verify default checkbox states', async () => {
      await expect(this.checkboxesPage.checkboxes.nth(0)).not.toBeChecked();
      await expect(this.checkboxesPage.checkboxes.nth(1)).toBeChecked();
    });
  }

  async toggleFirstCheckbox(): Promise<void> {
    await test.step('Toggle the first checkbox', async () => {
      await this.checkboxesPage.checkboxes.nth(0).check();
    });
  }

  async toggleSecondCheckboxOff(): Promise<void> {
    await test.step('Toggle the second checkbox off', async () => {
      await this.checkboxesPage.checkboxes.nth(1).uncheck();
    });
  }

  async shouldReflectUpdatedStates(): Promise<void> {
    await test.step('Verify updated checkbox states', async () => {
      await expect(this.checkboxesPage.checkboxes.nth(0)).toBeChecked();
      await expect(this.checkboxesPage.checkboxes.nth(1)).not.toBeChecked();
    });
  }
}
