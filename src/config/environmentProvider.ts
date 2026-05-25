import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export type EnvironmentSelection = {
  env: string;
  brand: string;
};

export type EnvironmentConfig = {
  env: string;
  brand: string;
  baseUrl: string;
  apiBaseUrl: string;
};

function getConfigPath(selection: EnvironmentSelection): string {
  return path.resolve(process.cwd(), 'config', 'environments', selection.env, `${selection.brand}.json`);
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

function getRequiredString(config: Record<string, unknown>, key: string, filePath: string): string {
  const value = config[key];

  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Invalid environment config "${filePath}": "${key}" must be a non-empty string.`);
  }

  return value;
}

function readEnvironmentFile(filePath: string): { baseUrl: string; apiBaseUrl: string } {
  const config = readJsonObject(filePath, 'environment');

  return {
    baseUrl: getRequiredString(config, 'baseUrl', filePath),
    apiBaseUrl: getRequiredString(config, 'apiBaseUrl', filePath)
  };
}

export function getEnvironmentConfig(selection: EnvironmentSelection): EnvironmentConfig {
  const filePath = getConfigPath(selection);
  const config = readEnvironmentFile(filePath);

  return {
    env: selection.env,
    brand: selection.brand,
    baseUrl: config.baseUrl,
    apiBaseUrl: config.apiBaseUrl
  };
}
