import fs = require('fs');
import path = require('path');
import zipFolderPromise = require('zip-folder-promise');
import inquirer = require('inquirer');
import confirmAsync from './confirmAsync';
import generateFilename from './generateFilename';
import setBackupName from './setBackupName';
import { IArguments } from './index';

const CWD = process.cwd();


export default async function handler({ 
  buildDir,
  zipDir,
  format,
  name,
  template,
}: IArguments): Promise<void> {
  try {
    const _askFilename = name;

    const BUILDPATH = path.join(CWD, buildDir);
    const OUTPATH = path.join(CWD, zipDir);

    if (!fs.existsSync(BUILDPATH)) {
      console.log(`There is no directory with the name '${buildDir}' in your project.`);
      process.exit(1);
    }

    if (!fs.existsSync(OUTPATH)) {
      const mkdirMsg = `There is no directory with the name '${zipDir}'. Do you want to create it?`;
      if (await confirmAsync(mkdirMsg)) {
        fs.mkdirSync(OUTPATH);
        console.log(`'${zipDir}' created!`);

        const gitIgMsg = `Do you want to include '${zipDir}' in your .gitignore?`;
        if (await confirmAsync(gitIgMsg)) {
          console.log(`Done!`);
          const GITIGNOREPATH = path.join(CWD, '.gitignore');
          fs.appendFileSync(GITIGNOREPATH, `\n${zipDir}`);
        }
      } else {
        console.log('Bye!');
        process.exit(0);
      }
    }

    let outfileName = generateFilename(template, format);
    if (_askFilename) {
      const ANS_NAME = await inquirer.prompt([{
        type: 'input',
        name: 'filename',
        message: 'Set output filename (including extension):',
      }]);

      if (ANS_NAME.filename) outfileName = ANS_NAME.filename;
    }

    const OUTFILE = await setBackupName(zipDir, outfileName, format);
    const OUTURI = path.join(OUTPATH, OUTFILE);

    const resMsg = await zipFolderPromise(BUILDPATH, OUTURI, format);

    const ZIPOUT = path.join(zipDir, OUTFILE);
    console.log(`${resMsg} to ${ZIPOUT}`);
  } catch (error) {
    console.log(error)
  }
}
