import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import zipFolderPromise from 'zip-folder-promise';
import { mocked } from 'jest-mock';

import handler from './handler';
import generateFilename from './generateFilename';

import { IArguments } from './index';

jest.mock('fs');
const __fs = mocked(fs);

jest.mock('inquirer');
const __inquirer = mocked(inquirer);

jest.mock('zip-folder-promise');
const __zipFolderPromise = mocked(zipFolderPromise);
__zipFolderPromise.mockResolvedValueOnce('#### bytes written');

const CWD = process.cwd();
const ARGS: IArguments = {
  _: [],
  $0: '',
  buildDir: 'dist',
  zipDir: 'build',
  format: 'zip',
  name: false,
  subDir: 'public',
  template: '%NAME%_%VERSION%_%TIMESTAMP%.%EXT%',
};

test('Create backup archive with default values', async () => {
  __fs.existsSync
    .mockReturnValueOnce(true)    // BUILDPATH
    .mockReturnValueOnce(true)    // OUTPATH
    .mockReturnValueOnce(false);  // outUri

  const BUILDPATH = path.join(CWD, ARGS.buildDir);
  const FILENAME = generateFilename(ARGS.template, ARGS.format);
  const OUTPATH = path.join(CWD, ARGS.zipDir, FILENAME);

  await handler(ARGS);

  expect(__zipFolderPromise).toHaveBeenCalled();
  expect(__zipFolderPromise)
    .toHaveBeenCalledWith(
      BUILDPATH,
      OUTPATH,
      ARGS.format,
      ARGS.subDir
    );
});

test('Create backup archive with default values in new directory', async () => {
  __fs.existsSync
    .mockReturnValueOnce(true)    // BUILDPATH
    .mockReturnValueOnce(false)    // OUTPATH
    .mockReturnValueOnce(false);  // outUri

    // Ask user confirmations..
  __inquirer.prompt
    // ..to create OUTPATH directory
    .mockResolvedValueOnce({ qname: true })
    // ..to append OUTPATH to .gitignore
    .mockResolvedValueOnce({ qname: true });

  await handler(ARGS);

  const OUTPATH = path.join(CWD, ARGS.zipDir);
  expect(__fs.mkdirSync).toHaveBeenCalled();
  expect(__fs.mkdirSync).toHaveBeenCalledWith(OUTPATH);

  const GITIGNOREPATH = path.join(CWD, '.gitignore');
  expect(__fs.appendFileSync).toHaveBeenCalled();
  expect(__fs.appendFileSync)
    .toHaveBeenCalledWith(GITIGNOREPATH, `\n${ARGS.zipDir}`);
});

test('Ask user for output file name', async () => {
  // --name flag is set to ask user for output file name
  ARGS.name = true;

  __fs.existsSync
    .mockReturnValueOnce(true)    // BUILDPATH
    .mockReturnValueOnce(true)    // OUTPATH
    .mockReturnValueOnce(false);  // outUri

  // Ask user for output file name
  __inquirer.prompt
    .mockResolvedValueOnce({ filename: 'test.zip' });

  const BUILDPATH = path.join(CWD, ARGS.buildDir);
  const OUTPATH = path.join(CWD, ARGS.zipDir, 'test.zip');

  await handler(ARGS);

  expect(__zipFolderPromise).toHaveBeenCalled();
  expect(__zipFolderPromise)
    .toHaveBeenCalledWith(
      BUILDPATH,
      OUTPATH,
      ARGS.format,
      ARGS.subDir
    );
});
