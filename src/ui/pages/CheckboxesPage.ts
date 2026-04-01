import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckboxesPage extends BasePage {
  readonly checkboxes: Locator;

  constructor(page: Page) {
    super(page);
    this.checkboxes = this.$('.example input[type="checkbox"]');
  }
}
