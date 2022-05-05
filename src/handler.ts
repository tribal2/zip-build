import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import zipFolderPromise from 'zip-folder-promise';

import userConfirmAsync from './userConfirmAsync';
import generateFilename from './generateFilename';
import userResolveConflictAsync from './userResolveConflictAsync';

import { IArguments } from './index';

const CWD = process.cwd();

export default async function handler({
  buildDir,   // 'build'
  zipDir,     // 'dist'
  format,     // 'zip'
  subDir,     // 'subdirectory'
  name,       // false
  template,   // '%NAME%_%VERSION%_%TIMESTAMP%.%EXT%'
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
      if (await userConfirmAsync(mkdirMsg)) {
        fs.mkdirSync(OUTPATH);
        console.log(`'${zipDir}' created!`);

        const gitIgMsg = `Do you want to include '${zipDir}' in your .gitignore?`;
        if (await userConfirmAsync(gitIgMsg)) {
          console.log(`Done!`);
          const GITIGNOREPATH = path.join(CWD, '.gitignore');
          fs.appendFileSync(GITIGNOREPATH, `\n${zipDir}`);
        }
      } else {
        console.log('Bye!');
        process.exit(0);
      }
    }

    let outfileName;
    if (!_askFilename) {
      outfileName = generateFilename(template, format);
    } else {
      const ANS_NAME = await inquirer.prompt([{
        type: 'input',
        name: 'filename',
        message: 'Set output filename (extension is optional):',
      }]);

      if (ANS_NAME.filename) outfileName = ANS_NAME.filename;
    }

    // Check if the file already exists, ask the user what to do
    let outUri = path.join(OUTPATH, outfileName);
    if (fs.existsSync(outUri)) {
      const newOutfileName = await userResolveConflictAsync(zipDir, outfileName);
      outUri = path.join(OUTPATH, newOutfileName);
    }

    const resMsg = await zipFolderPromise(BUILDPATH, outUri, format, subDir);
    console.log(`${resMsg} to ${outUri}`);
  }

  catch (error) {
    console.log(error)
  }
}
