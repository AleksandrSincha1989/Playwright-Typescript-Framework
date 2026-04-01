import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DynamicLoadingPage extends BasePage {
  readonly startButton: Locator;
  readonly loadingIndicator: Locator;
  readonly finishText: Locator;

  constructor(page: Page) {
    super(page);
    this.startButton = this.$('#start button');
    this.loadingIndicator = this.$('#loading');
    this.finishText = this.$('#finish');
  }
}
