import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import { mocked } from 'jest-mock';

import userResolveConflictAsync from '../userResolveConflictAsync';
import getTimestampString from '../getTimestampString';

jest.mock('fs');
jest.mock('inquirer');

const INPUT_FILENAME = 'file.zip';

test('Rename output file appending the current timestamp', async () => {
  mocked(inquirer).prompt.mockResolvedValueOnce({
    qname: 'Rename output file appending the current timestamp',
  });

  const TS = getTimestampString();
  const PARTS = path.parse(INPUT_FILENAME);

  const RES = await userResolveConflictAsync('dist', INPUT_FILENAME);
  expect(RES).toBe(`${PARTS.name}_${TS}${PARTS.ext}`);
});

test('Rename output file with another name', async () => {
  // mocked(fs).existsSync.mockReturnValueOnce(true);
  mocked(inquirer).prompt
    .mockResolvedValueOnce({
      qname: 'Rename output file with another name',
    })
    .mockResolvedValueOnce({
      filename: 'file2.zip',
    });

  const RES = await userResolveConflictAsync('dist', INPUT_FILENAME);
  expect(RES).toBe('file2.zip');
});

test('Rename output file with another name twice', async () => {
  mocked(fs).existsSync.mockReturnValueOnce(true);
  mocked(inquirer).prompt
    .mockResolvedValueOnce({
      qname: 'Rename output file with another name',
    })
    .mockResolvedValueOnce({
      filename: 'file2.zip',
    })
    .mockResolvedValueOnce({
      qname: 'Rename output file with another name',
    })
    .mockResolvedValueOnce({
      filename: 'file3.zip',
    });;

  const RES = await userResolveConflictAsync('dist', INPUT_FILENAME);
  expect(RES).toBe('file3.zip');
});

test('Overwrite existing file', async () => {
  // mocked(fs).existsSync.mockReturnValueOnce(true);
  mocked(inquirer).prompt.mockResolvedValueOnce({
    qname: 'Overwrite existing file',
  });

  const RES = await userResolveConflictAsync('dist', INPUT_FILENAME);
  expect(RES).toBe(INPUT_FILENAME);
});
