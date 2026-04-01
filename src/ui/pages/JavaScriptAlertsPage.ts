import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class JavaScriptAlertsPage extends BasePage {
  readonly jsAlertButton: Locator;
  readonly jsConfirmButton: Locator;
  readonly jsPromptButton: Locator;
  readonly resultText: Locator;

  constructor(page: Page) {
    super(page);
    this.jsAlertButton = this.$('button[onclick="jsAlert()"]');
    this.jsConfirmButton = this.$('button[onclick="jsConfirm()"]');
    this.jsPromptButton = this.$('button[onclick="jsPrompt()"]');
    this.resultText = this.$('#result');
  }
}
