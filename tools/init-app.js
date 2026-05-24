#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { STARTER_BUNDLE_FILES } from './starter-bundle.generated.js';

const cli = parseArgs(process.argv.slice(2));
const targetDir = path.resolve(process.cwd(), cli.targetDir || '.');
const defaultDisplayName = path.basename(targetDir) || 'gtplweb-app';
const metadata = await resolveMetadata(defaultDisplayName, cli);
const appName = metadata.packageName;
const appDisplayName = metadata.displayName;
const tagName = `${appName.replace(/[^a-z0-9]+/g, '-')}-app`.replace(/^-+|-+$/g, '') || 'gtplweb-app';
const copyrightLine = buildCopyrightLine(metadata);
const buildId = String(Date.now());

const vars = {
  '__APP_PACKAGE_NAME__': appName,
  '__APP_DISPLAY_NAME__': appDisplayName,
  '__APP_TAG_NAME__': tagName,
  '__APP_BUILD_ID__': buildId,
  '__APP_DESCRIPTION__': metadata.description,
  '__APP_AUTHOR__': metadata.author || '',
  '__APP_LICENSE__': metadata.license,
  '__APP_COPYRIGHT__': copyrightLine || ''
};

fs.mkdirSync(targetDir, { recursive: true });

for (const file of STARTER_BUNDLE_FILES) {
  const relPath = file.path;
  const fullPath = path.join(targetDir, relPath);
  if (fs.existsSync(fullPath)) {
    console.error(`Refusing to overwrite ${path.relative(process.cwd(), fullPath)}`);
    process.exit(1);
  }

  let content = Buffer.from(file.content, 'base64').toString('utf8');
  content = applyTemplate(content, vars);

  if (relPath === 'package.json') {
    const pkg = JSON.parse(content);
    if (!metadata.author) delete pkg.author;
    if (!copyrightLine) delete pkg.copyright;
    content = JSON.stringify(pkg, null, 2) + '\n';
  }

  if (relPath === 'README.md') {
    if (!metadata.author) {
      content = content.replace(/^Author:\s*.*\n/m, '');
    }
    if (!copyrightLine) {
      content = content.replace(/^Copyright:\s*.*\n/m, '');
    }
    content = content.replace(/\n{3,}/g, '\n\n');
  }

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

console.log(`GTPLWeb app created in ${path.relative(process.cwd(), targetDir) || '.'}`);
console.log('Starter scaffold loaded from tools/starter-template bundle');
console.log('Next: npm install && npm run build:dev && npm run server');

function applyTemplate(inputText, replacements) {
  let text = inputText;
  for (const [token, value] of Object.entries(replacements)) {
    text = text.split(token).join(String(value ?? ''));
  }
  return text;
}

function parseArgs(argv) {
  const parsed = {
    targetDir: null,
    yes: false
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--yes' || arg === '-y') parsed.yes = true;
    else if (arg === '--name') parsed.name = argv[++i];
    else if (arg.startsWith('--name=')) parsed.name = arg.slice('--name='.length);
    else if (arg === '--package-name') parsed.packageName = argv[++i];
    else if (arg.startsWith('--package-name=')) parsed.packageName = arg.slice('--package-name='.length);
    else if (arg === '--description') parsed.description = argv[++i];
    else if (arg.startsWith('--description=')) parsed.description = arg.slice('--description='.length);
    else if (arg === '--author') parsed.author = argv[++i];
    else if (arg.startsWith('--author=')) parsed.author = arg.slice('--author='.length);
    else if (arg === '--license') parsed.license = argv[++i];
    else if (arg.startsWith('--license=')) parsed.license = arg.slice('--license='.length);
    else if (arg === '--copyright-holder') parsed.copyrightHolder = argv[++i];
    else if (arg.startsWith('--copyright-holder=')) parsed.copyrightHolder = arg.slice('--copyright-holder='.length);
    else if (arg === '--copyright-year') parsed.copyrightYear = argv[++i];
    else if (arg.startsWith('--copyright-year=')) parsed.copyrightYear = arg.slice('--copyright-year='.length);
    else if (!arg.startsWith('-') && !parsed.targetDir) parsed.targetDir = arg;
  }
  return parsed;
}

async function resolveMetadata(defaultName, cliArgs) {
  const defaultLicense = process.env.npm_config_init_license || 'MIT';
  const defaultAuthor = process.env.npm_config_init_author_name || '';
  const defaultYear = String(new Date().getFullYear());

  let displayName = cliArgs.name || defaultName;
  let packageName = normalizePackageName(cliArgs.packageName || displayName);
  let description = cliArgs.description || `GTPLWeb app: ${displayName}`;
  let author = cliArgs.author || defaultAuthor;
  let license = cliArgs.license || defaultLicense;
  let copyrightHolder = cliArgs.copyrightHolder || author;
  let copyrightYear = String(cliArgs.copyrightYear || defaultYear);

  if (cliArgs.yes || !input.isTTY || !output.isTTY) {
    return {
      displayName,
      packageName,
      description,
      author,
      license,
      copyrightHolder,
      copyrightYear
    };
  }

  const rl = readline.createInterface({ input, output });
  try {
    displayName = await prompt(rl, 'App name', displayName);
    packageName = normalizePackageName(await prompt(rl, 'Package name', normalizePackageName(packageName || displayName)));
    description = await prompt(rl, 'Description', description);
    author = await prompt(rl, 'Author', author);
    license = await prompt(rl, 'License', license);
    copyrightHolder = await prompt(rl, 'Copyright holder', copyrightHolder);
    copyrightYear = await prompt(rl, 'Copyright year', copyrightYear);
  } finally {
    rl.close();
  }

  return {
    displayName,
    packageName,
    description,
    author,
    license,
    copyrightHolder,
    copyrightYear
  };
}

async function prompt(rl, label, fallback) {
  const text = await rl.question(`${label} [${fallback || ''}]: `);
  const value = text.trim();
  return value || fallback || '';
}

function buildCopyrightLine(meta) {
  const holder = String(meta.copyrightHolder || '').trim();
  const year = String(meta.copyrightYear || '').trim();
  if (!holder && !year) return '';
  if (holder && year) return `${year} ${holder}`;
  return holder || year;
}

function normalizePackageName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'gtplweb-app';
}
