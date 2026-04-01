import path from 'node:path';
import { test } from '../../../src/fixtures/test-fixtures';
import { FileUploadSteps } from '../../../src/ui/steps/FileUploadSteps';

test(
  'Should upload a file and show the uploaded file name',
  { tag: ['@TMS-1014', '@UI'] },
  async ({ page, logger }, testInfo) => {
    const fileUploadSteps = new FileUploadSteps(page, testInfo, logger);
    const uploadFilePath = path.resolve(process.cwd(), 'src', 'test-data', 'upload-demo.txt');

    await fileUploadSteps.open();
    await fileUploadSteps.uploadFile(uploadFilePath);
    await fileUploadSteps.shouldShowUploadedFile('upload-demo.txt');
  }
);