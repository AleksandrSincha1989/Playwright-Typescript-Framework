import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = this.$('.example h2');
    this.usernameInput = this.$('#username');
    this.passwordInput = this.$('#password');
    this.loginButton = this.$("button[type='submit']");
    this.flashMessage = this.$('#flash');
  }
}
