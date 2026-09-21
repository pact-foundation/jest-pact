#!/usr/bin/env node
// Release orchestration for jest-pact.
//
//   node scripts/release.ts prepare [--dry-run] [--debug]
//   node scripts/release.ts tag     [--dry-run] [--debug]
//   node scripts/release.ts changelog <version>
//
// `prepare` computes the next version with git-cliff, writes package.json and
// CHANGELOG.md, and creates or updates the draft release PR. `tag` reads the
// version from package.json and pushes the matching tag. `changelog` prints
// the release notes for a version, for the GitHub release body.
//
// Runs under Node's type stripping; only node:* modules are used.

import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export const PACKAGE_NAME = 'jest-pact';
export const RELEASE_BRANCH = 'release/jest-pact';
export const BASE_BRANCH = 'master';
export const TAG_PREFIX = 'v';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md');
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json');

const USAGE = `Usage:
  node scripts/release.ts prepare [--dry-run] [--debug]
  node scripts/release.ts tag [--dry-run] [--debug]
  node scripts/release.ts changelog <version>`;

export interface PullRequest {
  number: number;
  headRefName: string;
}

// MARK: Pure helpers

export function stripTagPrefix(
  tag: string,
  prefix: string = TAG_PREFIX,
): string {
  return tag.startsWith(prefix) ? tag.slice(prefix.length) : tag;
}

export function tagName(version: string): string {
  return `${TAG_PREFIX}${version}`;
}

/**
 * Turn `git cliff --bumped-version` output into the next version, or null
 * when there is nothing to release.
 *
 * git-cliff returns the current version when every commit since the last tag
 * is excluded from bumping (dependency updates, for example), so equality
 * with the version already in package.json counts as "nothing to do".
 */
export function nextVersion(
  bumpedTag: string | null,
  currentVersion: string,
): string | null {
  const trimmed = bumpedTag?.trim();
  if (!trimmed) {
    return null;
  }
  const version = stripTagPrefix(trimmed);
  return version === currentVersion ? null : version;
}

/** Parse `gh pr list --json number,headRefName --jq first` output. */
export function parseExistingPr(ghOutput: string): PullRequest | null {
  const text = ghOutput.trim();
  if (!text || text === 'null') {
    return null;
  }
  const data = JSON.parse(text) as { number: number; headRefName: string };
  return { number: data.number, headRefName: data.headRefName };
}

/**
 * Return the changelog body under the `## [version]` heading, up to the next
 * `## ` heading. Both cliff's `## [0.14.0] _date_` and standard-version's
 * `## [0.14.0](compare-url) (date)` headings contain `[version]`.
 */
export function extractChangelogSection(
  changelog: string,
  version: string,
): string {
  const marker = `[${version}]`;
  const section: string[] = [];
  let found = false;
  for (const line of changelog.split('\n')) {
    if (line.startsWith('## ')) {
      if (found) {
        break;
      }
      found = line.includes(marker);
      continue;
    }
    if (found) {
      section.push(line);
    }
  }
  return section.join('\n').trim();
}

/** The GitHub release body for a version. */
export function releaseNotes(changelog: string, version: string): string {
  const section = extractChangelogSection(changelog, version);
  if (section) {
    return `${section}\n`;
  }
  return `> [!WARNING]\n>\n> No changelog entry found for ${version}.\n`;
}

// MARK: Logging and processes

let debugEnabled = false;

function info(message: string): void {
  console.log(message);
}

function debug(message: string): void {
  if (debugEnabled) {
    console.error(`DEBUG: ${message}`);
  }
}

/** Run a command, streaming its output; throws on a non-zero exit. */
function exec(command: string, args: string[]): void {
  debug(`$ ${command} ${args.join(' ')}`);
  execFileSync(command, args, { cwd: ROOT, stdio: 'inherit' });
}

/** Run a command and return its stdout; throws on a non-zero exit. */
function capture(command: string, args: string[]): string {
  debug(`$ ${command} ${args.join(' ')}`);
  return execFileSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
}

/** Run a command and return its stdout, or null on a non-zero exit. */
function tryCapture(command: string, args: string[]): string | null {
  debug(`$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) {
    debug(`exit ${result.status}: ${result.stderr.trim()}`);
    return null;
  }
  return result.stdout;
}

// MARK: Repository state

function readVersion(): string {
  const pkg = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8')) as {
    version: string;
  };
  return pkg.version;
}

function writeVersion(version: string): void {
  exec('npm', ['version', version, '--no-git-tag-version']);
}

function computeNextVersion(): string | null {
  return nextVersion(
    tryCapture('git', ['cliff', '--bumped-version']),
    readVersion(),
  );
}

function generateChangelogBody(version: string): string {
  return capture('git', [
    'cliff',
    '--tag',
    tagName(version),
    '--unreleased',
    '--strip',
    'header',
  ]);
}

function updateChangelogFile(version: string): void {
  exec('git', [
    'cliff',
    '--tag',
    tagName(version),
    '--unreleased',
    '--prepend',
    CHANGELOG_PATH,
  ]);
}

function findOpenReleasePr(): PullRequest | null {
  const output = capture('gh', [
    'pr',
    'list',
    '--head',
    RELEASE_BRANCH,
    '--state',
    'open',
    '--json',
    'number,headRefName',
    '--jq',
    'first',
  ]);
  return parseExistingPr(output);
}

/**
 * Reset the fixed release branch onto the base branch, commit the prepared
 * files, force-push, and create or update the PR. A fixed branch name means
 * a changed version updates the open PR in place.
 */
function pushReleaseBranch(
  title: string,
  body: string,
  existing: PullRequest | null,
): void {
  exec('git', ['checkout', '-B', RELEASE_BRANCH, `origin/${BASE_BRANCH}`]);
  exec('git', ['add', PACKAGE_JSON_PATH, CHANGELOG_PATH]);
  exec('git', ['commit', '-m', title]);
  exec('git', ['push', '--force', 'origin', RELEASE_BRANCH]);
  if (existing) {
    exec('gh', [
      'pr',
      'edit',
      String(existing.number),
      '--title',
      title,
      '--body',
      body,
    ]);
  } else {
    exec('gh', [
      'pr',
      'create',
      '--title',
      title,
      '--body',
      body,
      '--base',
      BASE_BRANCH,
      '--draft',
    ]);
  }
}

/**
 * Make a GitHub token available to git-cliff and gh. CI provides GH_TOKEN;
 * locally, fall back to the gh CLI's stored credentials.
 */
function ensureGithubToken(): void {
  // Destructuring and Object.assign satisfy both tsc's
  // noPropertyAccessFromIndexSignature and Biome's useLiteralKeys.
  const { GITHUB_TOKEN, GH_TOKEN, CI } = process.env;
  if (GITHUB_TOKEN) {
    return;
  }
  if (GH_TOKEN) {
    Object.assign(process.env, { GITHUB_TOKEN: GH_TOKEN });
    return;
  }
  if (!CI) {
    const token = tryCapture('gh', ['auth', 'token'])?.trim();
    if (token) {
      Object.assign(process.env, { GITHUB_TOKEN: token });
      return;
    }
  }
  console.warn('No GitHub token found. API requests may be rate-limited.');
}

// MARK: Commands

function prepare(dryRun: boolean): void {
  const version = computeNextVersion();
  if (version === null) {
    info(`No version bump needed for ${PACKAGE_NAME}. Nothing to do.`);
    return;
  }
  info(`Proposed next version for ${PACKAGE_NAME}: ${version}`);

  const body = generateChangelogBody(version);
  const title = `chore(release): ${PACKAGE_NAME} v${version}`;
  const existing = findOpenReleasePr();

  // Always written so the result can be inspected locally; `git checkout --
  // package.json CHANGELOG.md` reverts them.
  writeVersion(version);
  updateChangelogFile(version);

  if (dryRun) {
    info(`\n--- Changelog for ${PACKAGE_NAME} v${version} ---\n${body}`);
    if (existing) {
      info(
        `[dry-run] Would update PR #${existing.number} title and body on branch '${RELEASE_BRANCH}'.`,
      );
    } else {
      info(
        `[dry-run] Would create PR '${title}' on branch '${RELEASE_BRANCH}' targeting ${BASE_BRANCH}.`,
      );
    }
    info(
      '[dry-run] Files written; use `git checkout -- package.json CHANGELOG.md` to revert.',
    );
    return;
  }

  try {
    pushReleaseBranch(title, body, existing);
  } finally {
    // Leave the checkout on the base branch even if the push or PR step failed
    exec('git', ['checkout', BASE_BRANCH]);
  }
  info(`Release PR for ${PACKAGE_NAME} v${version} created/updated.`);
}

/**
 * Tag the version in package.json. Idempotent: an existing tag is a no-op so
 * the workflow can be re-run after a transient failure.
 */
function tag(dryRun: boolean): void {
  const version = readVersion();
  const name = tagName(version);

  exec('git', ['fetch', '--tags', 'origin']);
  if (capture('git', ['tag', '--list', name]).trim()) {
    info(`Tag '${name}' already exists. Nothing to do.`);
    return;
  }

  if (dryRun) {
    info(`[dry-run] Would create and push tag '${name}'.`);
    return;
  }

  info(`Creating tag '${name}'...`);
  exec('git', ['tag', name]);
  exec('git', ['push', 'origin', name]);
  info(`Tag '${name}' pushed.`);
}

function changelog(version: string): void {
  process.stdout.write(
    releaseNotes(readFileSync(CHANGELOG_PATH, 'utf8'), version),
  );
}

function main(argv: string[]): void {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      'dry-run': { type: 'boolean', default: false },
      debug: { type: 'boolean', default: false },
    },
  });
  debugEnabled = values.debug;
  const [command, argument] = positionals;

  switch (command) {
    case 'prepare':
      ensureGithubToken();
      prepare(values['dry-run']);
      break;
    case 'tag':
      ensureGithubToken();
      tag(values['dry-run']);
      break;
    case 'changelog':
      if (!argument) {
        console.error(USAGE);
        process.exit(2);
      }
      changelog(argument);
      break;
    default:
      console.error(USAGE);
      process.exit(2);
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main(process.argv.slice(2));
}
