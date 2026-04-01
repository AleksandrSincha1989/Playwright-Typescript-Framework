const fs = require('node:fs/promises');
const path = require('node:path');

const groups = {
  all: ['test-results', 'playwright-report', 'allure-results', 'allure-report'],
  pw: ['test-results', 'playwright-report'],
  allure: ['allure-results', 'allure-report']
};

async function removeDirectory(directory) {
  const fullPath = path.resolve(process.cwd(), directory);
  await fs.rm(fullPath, { recursive: true, force: true });
  console.log(`Removed: ${directory}`);
}

async function main() {
  const target = process.argv[2] ?? 'all';
  const directories = groups[target];

  if (!directories) {
    console.error(`Unknown clean target: ${target}`);
    console.error(`Supported targets: ${Object.keys(groups).join(', ')}`);
    process.exit(1);
  }

  await Promise.all(directories.map(removeDirectory));
}

main().catch((error) => {
  console.error('Cleanup failed.');
  console.error(error);
  process.exit(1);
});