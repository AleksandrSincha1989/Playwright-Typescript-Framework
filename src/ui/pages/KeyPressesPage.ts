import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class KeyPressesPage extends BasePage {
  readonly input: Locator;
  readonly resultText: Locator;

  constructor(page: Page) {
    super(page);
    this.input = this.$('#target');
    this.resultText = this.$('#result');
  }
}
