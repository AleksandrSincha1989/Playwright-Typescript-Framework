import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MainPage extends BasePage {
  readonly heading: Locator;
  readonly flashMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = this.$('.example h2');
    this.flashMessage = this.$('#flash');
    this.logoutButton = this.$("a.button.secondary.radius");
  }
}