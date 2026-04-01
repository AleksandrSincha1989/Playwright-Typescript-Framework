import { expect, Page, TestInfo, test } from '@playwright/test';
import { TestLogger } from '../../logging/TestLogger';
import { DropdownPage } from '../pages/DropdownPage';

export class DropdownSteps {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly logger: TestLogger;
  private readonly dropdownPage: DropdownPage;

  constructor(page: Page, testInfo: TestInfo, logger: TestLogger) {
    this.page = page;
    this.testInfo = testInfo;
    this.logger = logger;
    this.dropdownPage = new DropdownPage(page);
  }

  async open(): Promise<void> {
    await test.step('Open dropdown page', async () => {
      await this.page.goto('/dropdown');
      await this.logger.log('Opened dropdown page');
    });
  }

  async selectOption(optionLabel: 'Option 1' | 'Option 2'): Promise<void> {
    await test.step(`Select ${optionLabel} from the dropdown`, async () => {
      await this.dropdownPage.dropdown.selectOption({ label: optionLabel });
      await this.logger.log('Dropdown option selected', { optionLabel });
    });
  }

  async shouldHaveSelectedOption(optionLabel: 'Option 1' | 'Option 2'): Promise<void> {
    await test.step(`Verify ${optionLabel} is selected`, async () => {
      await expect(this.dropdownPage.dropdown).toHaveValue(optionLabel === 'Option 1' ? '1' : '2');
      await this.logger.log('Dropdown selection verified', { optionLabel });
    });
  }
}
