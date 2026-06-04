const fs = require('node:fs');
const path = require('node:path');

/**
 * Converts Allure *-result.json files into a normalized analytics payload.
 *
 * Usage:
 *   node scripts/convert-allure-results.js <inputFolder> <outputFile> [environment] [browser] [brand]
 *
 * Example:
 *   node scripts/convert-allure-results.js ./allure-results ./normalized-run.json uat webkit MyBrand
 */

function printUsage() {
  console.error('Usage: node scripts/convert-allure-results.js <inputFolder> <outputFile> [environment] [browser] [brand]');
}

function warn(message) {
  console.warn(`Warning: ${message}`);
}

function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(content);
  } catch (error) {
    warn(`Skipped invalid JSON file: ${filePath} (${error.message})`);
    return null;
  }
}

function getFailureMessage(result) {
  const message = result.statusDetails && result.statusDetails.message;
  return typeof message === 'string' && message.length > 0 ? message : null;
}

function getDurationMs(result) {
  if (typeof result.start !== 'number' || typeof result.stop !== 'number') {
    return null;
  }

  return result.stop - result.start;
}

function getFinishedAt(result) {
  if (typeof result.stop !== 'number') {
    return null;
  }

  return new Date(result.stop).toISOString();
}

function normalizeResult(result, filePath) {
  const testUid = result.historyId || result.fullName || result.name;
  const name = result.name || result.fullName;

  if (!testUid) {
    warn(`Skipped result without historyId, fullName, or name: ${filePath}`);
    return null;
  }

  if (!name) {
    warn(`Skipped result without name or fullName: ${filePath}`);
    return null;
  }

  return {
    testUid,
    name,
    status: result.status || 'unknown',
    durationMs: getDurationMs(result),
    failureMessage: getFailureMessage(result),
    finishedAt: getFinishedAt(result)
  };
}

function validateInputFolder(inputFolder) {
  if (!fs.existsSync(inputFolder)) {
    throw new Error(`Input folder does not exist: ${inputFolder}`);
  }

  const stats = fs.statSync(inputFolder);
  if (!stats.isDirectory()) {
    throw new Error(`Input path is not a directory: ${inputFolder}`);
  }
}

function ensureOutputDirectory(outputFile) {
  const outputDirectory = path.dirname(outputFile);
  fs.mkdirSync(outputDirectory, { recursive: true });
}

function convertAllureResults(inputFolder, outputFile, metadata) {
  validateInputFolder(inputFolder);

  const resultFiles = fs
    .readdirSync(inputFolder)
    .filter((fileName) => fileName.endsWith('-result.json'));

  const results = [];
  let skippedFiles = 0;

  for (const fileName of resultFiles) {
    const filePath = path.join(inputFolder, fileName);
    const rawResult = readJsonFile(filePath);

    if (!rawResult) {
      skippedFiles += 1;
      continue;
    }

    const normalizedResult = normalizeResult(rawResult, filePath);

    if (!normalizedResult) {
      skippedFiles += 1;
      continue;
    }

    results.push(normalizedResult);
  }

  const payload = {
    metadata,
    results
  };

  ensureOutputDirectory(outputFile);
  fs.writeFileSync(outputFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  return {
    inputFolder,
    outputFile,
    metadata,
    totalResultFiles: resultFiles.length,
    totalExported: results.length,
    totalSkipped: skippedFiles
  };
}

function printSummary(summary) {
  console.log('Allure results converted.');
  console.log(`Input folder: ${summary.inputFolder}`);
  console.log(`Output file: ${summary.outputFile}`);
  console.log(`Environment: ${summary.metadata.environment || '(none)'}`);
  console.log(`Browser: ${summary.metadata.browser || '(none)'}`);
  console.log(`Brand: ${summary.metadata.brand || '(none)'}`);
  console.log(`Total *-result.json files found: ${summary.totalResultFiles}`);
  console.log(`Total results exported: ${summary.totalExported}`);
  console.log(`Total skipped files: ${summary.totalSkipped}`);
}

function main() {
  const [, , inputArg, outputArg, environment = null, browser = null, brand = null] = process.argv;

  if (!inputArg || !outputArg) {
    printUsage();
    process.exit(1);
  }

  const inputFolder = path.resolve(process.cwd(), inputArg);
  const outputFile = path.resolve(process.cwd(), outputArg);
  const metadata = { environment, browser, brand };
  const summary = convertAllureResults(inputFolder, outputFile, metadata);

  printSummary(summary);
}

try {
  main();
} catch (error) {
  console.error('Allure results conversion failed.');
  console.error(error.message);
  process.exit(1);
}
