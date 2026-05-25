import { test as base } from '@playwright/test';
import { type AccountProvider, type TestAccount } from '../config/accountProvider';
import { accountProvider, frameworkConfig } from '../config/frameworkConfigProvider';
import { TestLogger } from '../logging/TestLogger';

type WorkerFixtures = {
  accountProvider: AccountProvider;
  assignedAccount: TestAccount;
};

type TestFixtures = {
  getNamedAccount: (name: string) => TestAccount;
  logger: TestLogger;
  captureBrowserConsole: void;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  accountProvider: [
    async (_fixtures, use) => {
      await use(accountProvider);
    },
    { scope: 'worker' }
  ],
  assignedAccount: [
    async ({ accountProvider }, use, workerInfo) => {
      const assignedAccount = accountProvider.getWorkerAccount(workerInfo.workerIndex);
      await use(assignedAccount);
    },
    { scope: 'worker' }
  ],
  getNamedAccount: async ({ accountProvider }, use) => {
    await use((name: string) => accountProvider.getNamedAccount(name));
  },
  logger: async ({ assignedAccount }, use, testInfo) => {
    const logger = new TestLogger(testInfo.outputPath('log.txt'));

    await logger.log('Test started', {
      title: testInfo.title,
      workerIndex: testInfo.workerIndex,
      parallelIndex: testInfo.parallelIndex,
      retry: testInfo.retry,
      file: testInfo.file,
      environment: frameworkConfig.environment.env,
      brand: frameworkConfig.environment.brand,
      assignedAccount: assignedAccount.username
    });

    await use(logger);

    await logger.log('Test finished', {
      status: testInfo.status,
      expectedStatus: testInfo.expectedStatus,
      durationMs: testInfo.duration
    });

    await logger.flush();

    await testInfo.attach('execution-log', {
      path: logger.path,
      contentType: 'text/plain'
    });
  },
  captureBrowserConsole: [
    async ({ page, logger }, use) => {
      const consoleListener = (message: { type(): string; text(): string }) => {
        void logger.debug(`Browser console ${message.type()}`, message.text());
      };

      page.on('console', consoleListener);
      await use();
      page.off('console', consoleListener);
    },
    { auto: true }
  ]
});

export { expect } from '@playwright/test';
