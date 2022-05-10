import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import zipFolderPromise from 'zip-folder-promise';

import { userConfirmAsync } from './userConfirmAsync';
import generateFilename from './generateFilename';
import { userResolveConflictAsync, appendTimestampToFilename } from './userResolveConflictAsync';

import { IZipBuildArguments } from "./@types/IZipBuildArguments";

const CWD = process.cwd();

export default async function handler({
  buildDir,   // 'build'
  zipDir,     // 'dist'
  interactive,// false
  format,     // 'zip'
  subDir,     // 'subdirectory'
  name,       // false
  template,   // '%NAME%_%VERSION%_%TIMESTAMP%.%EXT%'
}: IZipBuildArguments): Promise<void> {
  try {
    const BUILDPATH = path.join(CWD, buildDir);
    const OUTPATH = path.join(CWD, zipDir);

    if (!fs.existsSync(BUILDPATH)) {
      console.log(`There is no directory with the name '${buildDir}' in your project.`);
      process.exit(1);
    }

    if (!fs.existsSync(OUTPATH)) {
      if (!interactive) {
        fs.mkdirSync(OUTPATH);
      } else {
        const mkdirMsg = `There is no directory with the name '${zipDir}'. Do you want to create it?`;
        const mkdirAnswer = await userConfirmAsync(mkdirMsg);
        if (mkdirAnswer) {
          fs.mkdirSync(OUTPATH);
          console.log(`'${zipDir}' created!`);

          const gitIgMsg = `Do you want to include '${zipDir}' in your .gitignore?`;
          const gitIgnoreAnswer = await userConfirmAsync(gitIgMsg);
          if (gitIgnoreAnswer) {
            console.log(`Done!`);
            const GITIGNOREPATH = path.join(CWD, '.gitignore');
            fs.appendFileSync(GITIGNOREPATH, `\n${zipDir}`);
          }
        } else {
          console.log('Bye!');
          process.exit(0);
        }
      }
    }

    let outfileName = generateFilename(template, format);
    if (interactive && name) {
      const { RESP_FILENAME } = await inquirer.prompt([{
        type: 'input',
        name: 'RESP_FILENAME',
        message: 'Set output filename (extension is optional):',
      }]);

      if (RESP_FILENAME) outfileName = RESP_FILENAME;
    }

    // Check if the file already exists, ask the user what to do
    let outUri = path.join(OUTPATH, outfileName);

    if (fs.existsSync(outUri)) {
      const newOutfileName = interactive
        ? await userResolveConflictAsync(zipDir, outfileName)
        : appendTimestampToFilename(outfileName);
      outUri = path.join(OUTPATH, newOutfileName);
    }

    const resMsg = await zipFolderPromise(BUILDPATH, outUri, format, subDir);
    console.log(`${resMsg} to ${outUri}`);
  }

  catch (error) {
    console.log(error)
  }
}
