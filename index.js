#!/usr/bin/env node
const fs = require('fs');
const inquirer = require('inquirer');
const zipFolder = require('zip-folder');

const defaults = {
  builddir: 'build',
  distdir: 'dist',
};

const CWD = process.cwd();
const PACKAGE = require(`${CWD}/package.json`);
const OPTS = PACKAGE.zipfolder || defaults;

const BUILDPATH = `${CWD}/${OPTS.builddir}`;
const OUTPATH = `${CWD}/${OPTS.distdir}`;

async function confirmAsync(message, _default = true) {
  const questions = [{
    type: 'confirm',
    name: 'qname',
    message,
    default: _default,
  }];

  const answerObj = await inquirer.prompt(questions);
  return answerObj.qname;
}

async function setBackupName(filename) {
  const URI = `${OUTPATH}/${filename}`;

  if (! fs.existsSync(URI)) return filename;

  const MSG = `The file '${filename}' already exists in directory `
    + `'${OPTS.distdir}'.. What do you want to do?`
  const ANS = await inquirer.prompt([{
    type: 'list',
    name: 'qname',
    message: MSG,
    choices: [
      'Overwrite existing file',
      'Rename zip file appending the current timestamp',
      'Rename zip file with another name',
      'Exit'
    ],
  }]);

  switch (ANS.qname) {
    case 'Overwrite existing file':
      return filename;

    case 'Rename zip file appending the current timestamp':
      return await setBackupName(`${PACKAGE.name}_${PACKAGE.version}_${Date.now()}.zip`);

    case 'Rename zip file with another name':
      const ANS_REN = await inquirer.prompt([{
        type: 'input',
        name: 'filename',
        message: 'New name for your zip file:',
      }]);
      return await setBackupName(`${ANS_REN.filename}.zip`);

    default:
      console.log('Bye!');
      process.exit(1);
  }
}

async function init() {
  if (!fs.existsSync(BUILDPATH)) {
    console.log(`There is no directory with the name '${OPTS.builddir}' in your project.`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPATH)) {
    const mkdirMsg = `There is no directory with the name '${OPTS.distdir}'. Do you want to create it?`;
    if (await confirmAsync(mkdirMsg)) {
      fs.mkdirSync(OUTPATH);
      console.log(`'${OPTS.distdir}' created!`);

      const gitIgMsg = `Do you want to include '${OPTS.distdir}' in your .gitignore?`;
      if (await confirmAsync(gitIgMsg)) {
        console.log(`Done!`);
        fs.appendFileSync(`${CWD}/.gitignore`, `\n${OPTS.distdir}`);
      }
    } else {
      console.log('Bye!');
      process.exit(1);
    }
  }

  const OUTFILE = await setBackupName(`${PACKAGE.name}_${PACKAGE.version}.zip`);
  const OUTURI = `${OUTPATH}/${OUTFILE}`;

  zipFolder(BUILDPATH, OUTURI, (err) => {
    if (err) {
      console.log('ERROR!', err);
    } else {
      console.log(`${OPTS.distdir}/${OUTFILE} written.`);
    }
  });

}

init().catch(err => console.log(err));
