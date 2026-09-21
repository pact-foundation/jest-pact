import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  extractChangelogSection,
  nextVersion,
  parseExistingPr,
  releaseNotes,
  stripTagPrefix,
  tagName,
} from './release.ts';

describe('stripTagPrefix', () => {
  it('removes the prefix when present', () => {
    assert.equal(stripTagPrefix('v1.2.3', 'v'), '1.2.3');
  });

  it('leaves a bare version alone', () => {
    assert.equal(stripTagPrefix('1.2.3', 'v'), '1.2.3');
  });

  it('defaults to the v prefix', () => {
    assert.equal(stripTagPrefix('v0.14.0'), '0.14.0');
  });
});

describe('tagName', () => {
  it('prefixes the version with v', () => {
    assert.equal(tagName('0.14.0'), 'v0.14.0');
  });
});

describe('nextVersion', () => {
  it('returns the stripped version when it differs from the current one', () => {
    assert.equal(nextVersion('v0.14.0\n', '0.13.0'), '0.14.0');
  });

  it('returns null when git cliff produced nothing', () => {
    assert.equal(nextVersion(null, '0.13.0'), null);
    assert.equal(nextVersion('', '0.13.0'), null);
    assert.equal(nextVersion('  \n', '0.13.0'), null);
  });

  it('returns null when only skipped commits exist since the last tag', () => {
    assert.equal(nextVersion('v0.13.0', '0.13.0'), null);
  });
});

describe('parseExistingPr', () => {
  it('parses a pull request object', () => {
    assert.deepEqual(
      parseExistingPr('{"number": 42, "headRefName": "release/jest-pact"}\n'),
      { number: 42, headRefName: 'release/jest-pact' },
    );
  });

  it('returns null for empty output', () => {
    assert.equal(parseExistingPr(''), null);
    assert.equal(parseExistingPr('  \n'), null);
  });

  it('returns null for the JSON literal null', () => {
    assert.equal(parseExistingPr('null\n'), null);
  });
});

const changelog = `# Changelog

All notable changes to this project will be documented in this file.

## [0.14.0] _2026-09-21_

### 🚀 Features

-   Declare types, exports and files in package.json

## [0.13.0](https://github.com/pact-foundation/jest-pact/compare/v0.11.4...v0.13.0) (2025-10-07)

### Features

-   Change Pact to PactV2

## [0.1.0] _2020-01-01_

-   First
`;

describe('extractChangelogSection', () => {
  it('returns the body between the version heading and the next version', () => {
    assert.equal(
      extractChangelogSection(changelog, '0.14.0'),
      '### 🚀 Features\n\n-   Declare types, exports and files in package.json',
    );
  });

  it('matches linked standard-version headings too', () => {
    assert.equal(
      extractChangelogSection(changelog, '0.13.0'),
      '### Features\n\n-   Change Pact to PactV2',
    );
  });

  it('matches the whole version, not a substring', () => {
    assert.equal(extractChangelogSection(changelog, '0.1.0'), '-   First');
    assert.equal(extractChangelogSection(changelog, '1.0'), '');
  });

  it('returns an empty string when the version is absent', () => {
    assert.equal(extractChangelogSection(changelog, '9.9.9'), '');
  });
});

describe('releaseNotes', () => {
  it('returns the section with a trailing newline', () => {
    assert.equal(
      releaseNotes(changelog, '0.14.0'),
      '### 🚀 Features\n\n-   Declare types, exports and files in package.json\n',
    );
  });

  it('returns a warning callout when the version is absent', () => {
    assert.equal(
      releaseNotes(changelog, '9.9.9'),
      '> [!WARNING]\n>\n> No changelog entry found for 9.9.9.\n',
    );
  });
});
