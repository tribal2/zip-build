import fs = require('fs');
import path = require('path');
import inquirer = require('inquirer');

import getTimestampString from './getTimestampString';

enum Choices {
  TIMESTAMP = 'Rename output file appending the current timestamp',
  RENAME = 'Rename output file with another name',
  OVERWRITE = 'Overwrite existing file',
  EXIT = 'Exit'
}

export function appendTimestampToFilename(filename: string) {
  const timestamp = getTimestampString();
  const { name, ext } = path.parse(filename);
  return `${name}_${timestamp}${ext}`;
}

export default async function userResolveConflictAsync(
  dstdir: string,
  filename: string,
): Promise<string> {

  const choices = Object.values(Choices);

  const MSG = `The file '${filename}' already exists in directory `
    + `'${dstdir}'.. What do you want to do?`

  const { QNAME }: { QNAME: Choices; } = await inquirer.prompt([{
    type: 'list',
    name: 'QNAME',
    message: MSG,
    choices,
  }]);

  let outfileName: string;
  switch (QNAME) {
    case Choices.TIMESTAMP:
      outfileName = appendTimestampToFilename(filename);
      break;

    case Choices.RENAME:
      const ANS_REN = await inquirer.prompt([{
        type: 'input',
        name: 'filename',
        message: 'New name for your file:',
      }]);
      outfileName = ANS_REN.filename;
      break;

    case Choices.OVERWRITE:
      return filename;

    case Choices.EXIT:
    default:
      console.log('Bye!');
      process.exit(0);
  }

  const OUTPATH = path.join(process.cwd(), dstdir);
  const URI = path.join(OUTPATH, outfileName);

  // If the new filename already exists, ask the user what to do again
  if (fs.existsSync(URI)) {
    return await userResolveConflictAsync(dstdir, outfileName);
  }

  return outfileName;
}
