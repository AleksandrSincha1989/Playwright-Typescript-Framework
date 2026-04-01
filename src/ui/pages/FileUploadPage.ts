import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class FileUploadPage extends BasePage {
  readonly chooseFileInput: Locator;
  readonly uploadButton: Locator;
  readonly uploadedFiles: Locator;

  constructor(page: Page) {
    super(page);
    this.chooseFileInput = this.$('#file-upload');
    this.uploadButton = this.$('#file-submit');
    this.uploadedFiles = this.$('#uploaded-files');
  }
}
