import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import zipFolderPromise from 'zip-folder-promise';
import { mocked } from 'jest-mock';

import handler from '../handler';
import generateFilename from '../generateFilename';

import { IZipBuildArguments } from '../@types/IZipBuildArguments';
import { ZipBuildFormat } from '../@types/ZipBuildFormat';
import { userConfirmAsync } from '../userConfirmAsync';
import { userResolveConflictAsync, appendTimestampToFilename } from '../userResolveConflictAsync';

jest.mock('fs');
const __fs = mocked(fs);

jest.mock('inquirer');
const __inquirer = mocked(inquirer);

jest.mock('zip-folder-promise');
const __zipFolderPromise = mocked(zipFolderPromise);
__zipFolderPromise.mockResolvedValueOnce('#### bytes written');

jest.mock('../userConfirmAsync');
const __userConfirmAsync = mocked(userConfirmAsync);
const __appendTimestampToFilename = mocked(appendTimestampToFilename);

jest.mock('../userResolveConflictAsync');
const __userResolveConflictAsync = mocked(userResolveConflictAsync)

const CWD = process.cwd();
const ARGS: IZipBuildArguments = {
  _: [],
  $0: '',
  buildDir: 'dist',
  zipDir: 'build',
  interactive: false,
  format: ZipBuildFormat.ZIP,
  name: false,
  template: '%NAME%_%VERSION%_%TIMESTAMP%.%EXT%',
};

const BUILDPATH = path.join(CWD, ARGS.buildDir);
const FILENAME = generateFilename(ARGS.template, ARGS.format);
const OUTPATH = path.join(CWD, ARGS.zipDir, FILENAME);

afterEach(() => {
  __userConfirmAsync.mockReset();
});

describe('non-interactive mode', () => {

  test('Create backup archive with default values', async () => {
    ARGS.interactive = false;

    __fs.existsSync
      .mockReturnValueOnce(true)    // BUILDPATH
      .mockReturnValueOnce(false)   // OUTPATH
      .mockReturnValueOnce(false);  // outUri

    // Ask for user confirmations..
    __userConfirmAsync.mockResolvedValue(true);

    await handler(ARGS);

    // Non-interactive mode
    expect(__userConfirmAsync).toHaveBeenCalledTimes(0);
    expect(__inquirer.prompt).toHaveBeenCalledTimes(0);
    expect(__userResolveConflictAsync).toHaveBeenCalledTimes(0);

    expect(__appendTimestampToFilename).toHaveBeenCalledTimes(0);

    expect(__zipFolderPromise).toHaveBeenCalled();
    expect(__zipFolderPromise)
      .toHaveBeenCalledWith(
        BUILDPATH,
        OUTPATH,
        ARGS.format
      );
  });

  test(
    'Create backup archive with default values, conflicting output filename',
    async () => {
      ARGS.interactive = false;

      __fs.existsSync
        .mockReturnValueOnce(true)   // BUILDPATH
        .mockReturnValueOnce(true)   // OUTPATH     **
        .mockReturnValueOnce(true);  // outUri      **

      // Ask for user confirmations..
      __userConfirmAsync.mockResolvedValue(true);

      // Output filename conflict resolution
      __appendTimestampToFilename.mockReturnValue(FILENAME);

      await handler(ARGS);

      expect(__appendTimestampToFilename).toHaveBeenCalledTimes(1); // **

      expect(__zipFolderPromise).toHaveBeenCalled();
      expect(__zipFolderPromise)
        .toHaveBeenCalledWith(
          BUILDPATH,
          OUTPATH,
          ARGS.format
        );
    }
  );

});

describe('interactive mode', () => {

  test('Create backup archive with default values in new directory', async () => {
    ARGS.interactive = true;

    __fs.existsSync
      .mockReturnValueOnce(true)    // BUILDPATH
      .mockReturnValueOnce(false)   // OUTPATH
      .mockReturnValueOnce(false);  // outUri

    // Ask for user confirmations..
    __userConfirmAsync
      .mockResolvedValueOnce(true)  // ..to create OUTPATH directory
      .mockResolvedValueOnce(true); // ..to append OUTPATH to .gitignore

    await handler(ARGS);

    expect(__userConfirmAsync).toHaveBeenCalledTimes(2);

    const OUTPATH = path.join(CWD, ARGS.zipDir);
    expect(__fs.mkdirSync).toHaveBeenCalled();
    expect(__fs.mkdirSync).toHaveBeenCalledWith(OUTPATH);

    const GITIGNOREPATH = path.join(CWD, '.gitignore');
    expect(__fs.appendFileSync).toHaveBeenCalled();
    expect(__fs.appendFileSync)
      .toHaveBeenCalledWith(GITIGNOREPATH, `\n${ARGS.zipDir}`);
  });

  test('Ask user for output file name', async () => {
    ARGS.interactive = true;

    // --name flag is set to ask user for output file name
    ARGS.name = true;

    __fs.existsSync
      .mockReturnValueOnce(true)    // BUILDPATH
      .mockReturnValueOnce(true)    // OUTPATH
      .mockReturnValueOnce(false);  // outUri

    // Ask user for output file name
    __inquirer.prompt
      .mockResolvedValueOnce({ RESP_FILENAME: 'test.zip' });

    const BUILDPATH = path.join(CWD, ARGS.buildDir);
    const OUTPATH = path.join(CWD, ARGS.zipDir, 'test.zip');

    await handler(ARGS);

    expect(__zipFolderPromise).toHaveBeenCalled();
    expect(__zipFolderPromise)
      .toHaveBeenCalledWith(
        BUILDPATH,
        OUTPATH,
        ARGS.format
      );
  });

});
