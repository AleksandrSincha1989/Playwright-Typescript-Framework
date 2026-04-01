import { expect, Page, TestInfo, test } from '@playwright/test';
import { TestLogger } from '../../logging/TestLogger';
import { AddRemoveElementsPage } from '../pages/AddRemoveElementsPage';

export class AddRemoveElementsSteps {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly logger: TestLogger;
  private readonly addRemoveElementsPage: AddRemoveElementsPage;

  constructor(page: Page, testInfo: TestInfo, logger: TestLogger) {
    this.page = page;
    this.testInfo = testInfo;
    this.logger = logger;
    this.addRemoveElementsPage = new AddRemoveElementsPage(page);
  }

  async open(): Promise<void> {
    await test.step('Open add/remove elements page', async () => {
      await this.page.goto('/add_remove_elements/');
      await this.logger.log('Opened add/remove elements page');
    });
  }

  async addElements(count: number): Promise<void> {
    await test.step(`Add ${count} elements`, async () => {
      for (let index = 0; index < count; index += 1) {
        await this.addRemoveElementsPage.addElementButton.click();
      }
      await this.logger.log('Elements added', { count });
    });
  }

  async removeElementAt(index: number): Promise<void> {
    await test.step(`Remove element at index ${index}`, async () => {
      await this.addRemoveElementsPage.deleteButtons.nth(index).click();
      await this.logger.log('Element removed', { index });
    });
  }

  async shouldHaveDeleteButtons(count: number): Promise<void> {
    await test.step(`Verify there are ${count} delete buttons`, async () => {
      await expect(this.addRemoveElementsPage.deleteButtons).toHaveCount(count);
      await this.logger.log('Delete button count verified', { count });
    });
  }
}
