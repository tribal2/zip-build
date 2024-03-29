// This is my first test ever =)

import generateFilename from '../generateFilename';
import { ZipBuildFormat } from '../@types/ZipBuildFormat';

const CWD = process.cwd();
const PACKAGE = require(`${CWD}/package.json`);

const VERSION = PACKAGE.version;

const NIX_REGEX = /^zip-build_[0-9]+\.[0-9]+\.[0-9]+_[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.(zip|tar)$/;
const WIN_REGEX = /^zip-build_[0-9]+\.[0-9]+\.[0-9]+_[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}h[0-9]{2}m[0-9]{2}s\.(zip|tar)$/;

test('Use default template when template is an empty string', () => {
  expect(generateFilename('', ZipBuildFormat.ZIP, 'win32'))
  .toMatch(WIN_REGEX);
});

test('Name and version filename with <zip> extension', () => {
  expect(generateFilename('%NAME%_%VERSION%.%EXT%', ZipBuildFormat.ZIP, 'linux'))
    .toBe(`zip-build_${VERSION}.zip`);
});

test('Name and version filename with <tar> extension', () => {
  expect(generateFilename('%NAME%_%VERSION%.%EXT%', ZipBuildFormat.TAR, 'linux'))
    .toBe(`zip-build_${VERSION}.tar`);
});

test('Name, version and timestamp in Windows platform', () => {
  expect(generateFilename('%NAME%_%VERSION%_%TIMESTAMP%.%EXT%', ZipBuildFormat.TAR, 'win32'))
    .toMatch(WIN_REGEX);
});

test('Name, version and timestamp in other than Windows platforms', () => {
  expect(generateFilename('%NAME%_%VERSION%_%TIMESTAMP%.%EXT%', ZipBuildFormat.ZIP, 'linux'))
    .toMatch(NIX_REGEX);
});

test('Name and version with custom extension', () => {
  expect(generateFilename('%NAME%_%VERSION%.myext', ZipBuildFormat.ZIP, 'linux'))
    .toBe(`zip-build_${VERSION}.myext`);
});
