import {
  createAccountProvider,
  loadAccountsConfig,
  type AccountProvider,
  type AccountsConfig
} from './accountProvider';
import {
  getEnvironmentConfig,
  type EnvironmentConfig,
  type EnvironmentSelection
} from './environmentProvider';

export const supportedBrowsers = ['chromium', 'firefox', 'webkit'] as const;

export type SupportedBrowser = (typeof supportedBrowsers)[number];

export type FrameworkConfig = {
  environment: EnvironmentConfig;
  execution: {
    browser: SupportedBrowser;
    headless: boolean;
    workers: number;
    slowMoMs: number;
    defaultTimeoutMs: number;
    viewport: {
      width: number;
      height: number;
    };
  };
  accounts: AccountsConfig;
};

const TEST_ENV_NAMES = ['TEST_ENV'] as const;
const TEST_BRAND_NAMES = ['TEST_BRAND'] as const;
const BROWSER_NAMES = ['BROWSER', 'PW_BROWSER'] as const;
const HEADLESS_NAMES = ['HEADLESS', 'PW_HEADLESS'] as const;
const WORKER_NAMES = ['WORKERS', 'PW_WORKERS'] as const;
const BASE_URL_NAMES = ['BASE_URL', 'PW_BASE_URL'] as const;
const API_BASE_URL_NAMES = ['API_BASE_URL'] as const;
const SLOW_MO_NAMES = ['PW_SLOW_MO'] as const;
const DEFAULT_TIMEOUT_NAMES = ['PW_DEFAULT_TIMEOUT'] as const;
const VIEWPORT_WIDTH_NAMES = ['PW_VIEWPORT_WIDTH'] as const;
const VIEWPORT_HEIGHT_NAMES = ['PW_VIEWPORT_HEIGHT'] as const;

function getEnvValue(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];

    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function getString(names: readonly string[], defaultValue: string): string {
  return getEnvValue(names) ?? defaultValue;
}

function getBoolean(names: readonly string[], defaultValue: boolean): boolean {
  const value = getEnvValue(names);

  if (value === undefined) {
    return defaultValue;
  }

  if (value.toLowerCase() === 'true') {
    return true;
  }

  if (value.toLowerCase() === 'false') {
    return false;
  }

  throw new Error(`Invalid boolean value for ${names[0]}: ${value}`);
}

function getInteger(names: readonly string[], defaultValue: number): number {
  const value = getEnvValue(names);

  if (value === undefined) {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`Invalid integer value for ${names[0]}: ${value}`);
  }

  return parsed;
}

function getNumber(names: readonly string[], defaultValue: number): number {
  const value = getEnvValue(names);

  if (value === undefined) {
    return defaultValue;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric value for ${names[0]}: ${value}`);
  }

  return parsed;
}

function isSupportedBrowser(value: string): value is SupportedBrowser {
  return supportedBrowsers.some((browser) => browser === value);
}

function getBrowser(): SupportedBrowser {
  const browserValue = getString(BROWSER_NAMES, 'chromium').toLowerCase();

  if (!isSupportedBrowser(browserValue)) {
    throw new Error(
      `Unsupported BROWSER value "${browserValue}". Supported values: ${supportedBrowsers.join(', ')}.`
    );
  }

  return browserValue;
}

function getSelection(): EnvironmentSelection {
  return {
    env: getString(TEST_ENV_NAMES, 'dev'),
    brand: getString(TEST_BRAND_NAMES, 'brandA')
  };
}

const selection = getSelection();
const resolvedEnvironment = getEnvironmentConfig(selection);
const baseUrlOverride = getEnvValue(BASE_URL_NAMES);
const apiBaseUrlOverride = getEnvValue(API_BASE_URL_NAMES);
const accounts = loadAccountsConfig(selection);
const resolvedAccountProvider = createAccountProvider(accounts, selection);
const workers = getInteger(WORKER_NAMES, 2);

resolvedAccountProvider.validateWorkerPool(workers);

export const frameworkConfig: FrameworkConfig = {
  environment: {
    ...resolvedEnvironment,
    baseUrl: baseUrlOverride ?? resolvedEnvironment.baseUrl,
    apiBaseUrl: apiBaseUrlOverride ?? resolvedEnvironment.apiBaseUrl
  },
  execution: {
    browser: getBrowser(),
    headless: getBoolean(HEADLESS_NAMES, false),
    workers,
    slowMoMs: getNumber(SLOW_MO_NAMES, 0),
    defaultTimeoutMs: getNumber(DEFAULT_TIMEOUT_NAMES, 10_000),
    viewport: {
      width: getInteger(VIEWPORT_WIDTH_NAMES, 1440),
      height: getInteger(VIEWPORT_HEIGHT_NAMES, 900)
    }
  },
  accounts
};

export const accountProvider: AccountProvider = resolvedAccountProvider;
