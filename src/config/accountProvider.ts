import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { EnvironmentSelection } from './environmentProvider';

export type TestAccount = {
  username: string;
  password: string;
};

export type AccountsConfig = {
  default: TestAccount[];
  named: Record<string, TestAccount>;
};

export type AccountProvider = {
  getWorkerAccount(workerIndex: number): TestAccount;
  getNamedAccount(name: string): TestAccount;
  validateWorkerPool(workerCount: number): void;
};

function getConfigPath(selection: EnvironmentSelection): string {
  return path.resolve(process.cwd(), 'config', 'accounts', selection.env, `${selection.brand}.json`);
}

function readJsonObject(filePath: string, configName: string): Record<string, unknown> {
  if (!existsSync(filePath)) {
    throw new Error(`Missing ${configName} config. Expected file: "${filePath}".`);
  }

  let parsedConfig: unknown;

  try {
    parsedConfig = JSON.parse(readFileSync(filePath, 'utf8')) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse ${configName} config "${filePath}": ${error.message}`, { cause: error });
    }

    throw error;
  }

  if (typeof parsedConfig !== 'object' || parsedConfig === null || Array.isArray(parsedConfig)) {
    throw new Error(`Invalid ${configName} config "${filePath}": expected a JSON object.`);
  }

  return parsedConfig as Record<string, unknown>;
}

function validateAccount(account: unknown, context: string): asserts account is TestAccount {
  if (typeof account !== 'object' || account === null || Array.isArray(account)) {
    throw new Error(`Invalid account entry for ${context}: expected an object with username and password.`);
  }

  const candidate = account as Record<string, unknown>;

  if (typeof candidate.username !== 'string' || candidate.username.length === 0) {
    throw new Error(`Invalid account username for ${context}: expected a non-empty string.`);
  }

  if (typeof candidate.password !== 'string' || candidate.password.length === 0) {
    throw new Error(`Invalid account password for ${context}: expected a non-empty string.`);
  }
}

export function loadAccountsConfig(selection: EnvironmentSelection): AccountsConfig {
  const filePath = getConfigPath(selection);
  const config = readJsonObject(filePath, 'accounts');

  if (!Array.isArray(config.default)) {
    throw new Error(`Invalid accounts config "${filePath}": "default" must be an array.`);
  }

  if (typeof config.named !== 'object' || config.named === null || Array.isArray(config.named)) {
    throw new Error(`Invalid accounts config "${filePath}": "named" must be an object.`);
  }

  const namedAccounts = config.named as Record<string, unknown>;

  return {
    default: config.default.map((account: unknown, index: number) => {
      validateAccount(account, `default[${index}] in ${filePath}`);
      return account;
    }),
    named: Object.fromEntries(
      Object.entries(namedAccounts).map(([name, account]) => {
        validateAccount(account, `named.${name} in ${filePath}`);
        return [name, account];
      })
    )
  };
}

export function createAccountProvider(
  accounts: AccountsConfig,
  selection: EnvironmentSelection
): AccountProvider {
  return {
    getWorkerAccount(workerIndex: number): TestAccount {
      if (accounts.default.length === 0) {
        throw new Error(`No default accounts configured for env "${selection.env}" and brand "${selection.brand}".`);
      }

      return accounts.default[workerIndex % accounts.default.length];
    },
    getNamedAccount(name: string): TestAccount {
      const account = accounts.named[name];

      if (!account) {
        const availableAccounts = Object.keys(accounts.named).sort();
        throw new Error(
          `Named account "${name}" is not defined for env "${selection.env}" and brand "${selection.brand}". ` +
            `Available named accounts: ${availableAccounts.length > 0 ? availableAccounts.join(', ') : 'none'}.`
        );
      }

      return account;
    },
    validateWorkerPool(workerCount: number): void {
      if (accounts.default.length < workerCount) {
        throw new Error(
          `Insufficient default accounts for env "${selection.env}" and brand "${selection.brand}": ` +
            `configured ${accounts.default.length} account(s) for ${workerCount} worker(s). ` +
            `Add more accounts to "${getConfigPath(selection)}" or reduce WORKERS.`
        );
      }
    }
  };
}
