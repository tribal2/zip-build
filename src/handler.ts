const fs = require('fs');
const path = require('path');
const zipFolderPromise = require('zip-folder-promise');
const inquirer = require('inquirer');
const { confirmAsync } = require('./confirmAsync.js');
const { generateFilename } = require('./generateFilename.js');
const { setBackupName } = require('./setBackupName.js');

const CWD = process.cwd();

async function handler({ buildDir, zipDir, format, name, template }) {
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

module.exports = handler;
