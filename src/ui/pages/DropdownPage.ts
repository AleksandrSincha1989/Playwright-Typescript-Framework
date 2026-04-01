import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DropdownPage extends BasePage {
  readonly dropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.dropdown = this.$('#dropdown');
  }
}
