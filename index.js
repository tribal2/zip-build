#!/usr/bin/env node
const fs = require('fs');
const inquirer = require('inquirer');
const yargs = require('yargs/yargs');
const zipFolder = require('zip-folder');

const CWD = process.cwd();
const PACKAGE = require(`${CWD}/package.json`);

const { hideBin } = require('yargs/helpers')
yargs(hideBin(process.argv))
  .command(
    '$0 [build-dir] [zip-dir] [options]',
    'Zip your <build-dir> directory into <zip-dir>',
    (yargs) => {
      yargs
        .usage('Usage: $0 <build-dir> <zip-dir> [options]')
        .positional('build-dir', {
          describe: 'Directory of your build output',
          default: 'build'
        })
        .positional('zip-dir', {
          describe: 'Directory for your zipped backup',
          default: 'dist'
        })
        .example('$0', 'Zip build directory and put archive under dist directory.')
        .example('$0 out backup', 'Zip out directory and put archive under backup directory.')
    },
    (argv) => {
      const { buildDir, zipDir } = argv;
      init(buildDir, zipDir)
        .catch(err => console.log(err));
    }
  )
  .help('h')
  .alias('h', 'help')
  .argv;

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

async function setBackupName(dstdir, filename) {
  const OUTPATH = `${CWD}/${dstdir}`;
  const URI = `${OUTPATH}/${filename}`;

  if (! fs.existsSync(URI)) return filename;

  const MSG = `The file '${filename}' already exists in directory `
    + `'${dstdir}'.. What do you want to do?`
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
      return await setBackupName(
        dstdir,
        `${PACKAGE.name}_${PACKAGE.version}_${Date.now()}.zip`
      );

    case 'Rename zip file with another name':
      const ANS_REN = await inquirer.prompt([{
        type: 'input',
        name: 'filename',
        message: 'New name for your zip file:',
      }]);
      return await setBackupName(dstdir, `${ANS_REN.filename}.zip`);

    default:
      console.log('Bye!');
      process.exit(1);
  }
}

async function init(srcdir = 'build', dstdir = 'dist') {
  const BUILDPATH = `${CWD}/${srcdir}`;
  const OUTPATH = `${CWD}/${dstdir}`;

  if (!fs.existsSync(BUILDPATH)) {
    console.log(`There is no directory with the name '${srcdir}' in your project.`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPATH)) {
    const mkdirMsg = `There is no directory with the name '${dstdir}'. Do you want to create it?`;
    if (await confirmAsync(mkdirMsg)) {
      fs.mkdirSync(OUTPATH);
      console.log(`'${dstdir}' created!`);

      const gitIgMsg = `Do you want to include '${dstdir}' in your .gitignore?`;
      if (await confirmAsync(gitIgMsg)) {
        console.log(`Done!`);
        fs.appendFileSync(`${CWD}/.gitignore`, `\n${dstdir}`);
      }
    } else {
      console.log('Bye!');
      process.exit(1);
    }
  }

  const OUTFILE = await setBackupName(dstdir, `${PACKAGE.name}_${PACKAGE.version}.zip`);
  const OUTURI = `${OUTPATH}/${OUTFILE}`;

  zipFolder(BUILDPATH, OUTURI, (err) => {
    if (err) {
      console.log('ERROR!', err);
    } else {
      console.log(`${dstdir}/${OUTFILE} written.`);
    }
  });

}
