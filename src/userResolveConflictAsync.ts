import fs = require('fs');
import path = require('path');
import inquirer = require('inquirer');

import getTimestampString from './getTimestampString';

export default async function userResolveConflictAsync(
  dstdir: string,
  filename: string,
): Promise<string> {

  const choices = [
    'Rename output file appending the current timestamp',
    'Rename output file with another name',
    'Overwrite existing file',
    'Exit'
  ];

  const MSG = `The file '${filename}' already exists in directory `
    + `'${dstdir}'.. What do you want to do?`

  const ANS = await inquirer.prompt([{
    type: 'list',
    name: 'qname',
    message: MSG,
    choices,
  }]);

  let outfileName: string;
  switch (ANS.qname) {
    case choices[0]:
      const timestamp = getTimestampString();
      const PARTS = path.parse(filename);
      outfileName = `${PARTS.name}_${timestamp}${PARTS.ext}`;
      break;

    case choices[1]:
      const ANS_REN = await inquirer.prompt([{
        type: 'input',
        name: 'filename',
        message: 'New name for your file:',
      }]);
      outfileName = ANS_REN.filename;
      break;

    case choices[2]:
      return filename;

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
