import fs = require('fs');
import path = require('path');
import inquirer = require('inquirer');

import { TFormat } from './index';

export default async function setBackupName(
  dstdir: string,
  filename: string,
  format: TFormat,
): Promise<string> {
  const FILEPARTS = path.parse(filename);
  const FILEBASE = (FILEPARTS.ext === '')
    ? `${FILEPARTS.name}.${format}`
    : filename;
  
  const OUTPATH = path.join(process.cwd(), dstdir);
  const URI = path.join(OUTPATH, FILEBASE);

  if (! fs.existsSync(URI)) return FILEBASE;

  const PARTS = path.parse(URI);

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

  switch (ANS.qname) {
    case choices[0]:
      const now = new Date();
      const timestamp = now.toISOString().slice(0, -5); // eg: 2021-03-27T04:17:04
      filename = `${PARTS.name}_${timestamp}${PARTS.ext}`;
      return await setBackupName(dstdir, filename, format);

    case choices[1]:
      const ANS_REN = await inquirer.prompt([{
        type: 'input',
        name: 'filename',
        message: 'New name for your file:',
      }]);
      return await setBackupName(dstdir, `${ANS_REN.filename}`, format);

    case choices[2]:
      return filename;

    default:
      console.log('Bye!');
      process.exit(0);
  }
}
