import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  protected $(selector: string): Locator {
    return this.page.locator(selector);
  }
}