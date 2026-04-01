import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddRemoveElementsPage extends BasePage {
  readonly addElementButton: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.addElementButton = this.$('button[onclick="addElement()"]');
    this.deleteButtons = this.$('.added-manually');
  }
}
