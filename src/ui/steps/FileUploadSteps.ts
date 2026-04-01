import { expect, Page, TestInfo, test } from '@playwright/test';
import { basename } from 'node:path';
import { TestLogger } from '../../logging/TestLogger';
import { FileUploadPage } from '../pages/FileUploadPage';

export class FileUploadSteps {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly logger: TestLogger;
  private readonly fileUploadPage: FileUploadPage;

  constructor(page: Page, testInfo: TestInfo, logger: TestLogger) {
    this.page = page;
    this.testInfo = testInfo;
    this.logger = logger;
    this.fileUploadPage = new FileUploadPage(page);
  }

  async open(): Promise<void> {
    await test.step('Open file upload page', async () => {
      await this.page.goto('/upload');
      await this.logger.log('Opened file upload page');
    });
  }

  async uploadFile(filePath: string): Promise<void> {
    await test.step(`Upload file ${basename(filePath)}`, async () => {
      await this.fileUploadPage.chooseFileInput.setInputFiles(filePath);
      await this.fileUploadPage.uploadButton.click();
      await this.logger.log('File uploaded', { filePath });
    });
  }

  async shouldShowUploadedFile(fileName: string): Promise<void> {
    await test.step(`Verify uploaded file ${fileName} is shown`, async () => {
      await expect(this.fileUploadPage.uploadedFiles).toHaveText(fileName);
      await this.logger.log('Uploaded file verified', { fileName });
    });
  }
}
