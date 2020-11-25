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

async function init() {
  if (!fs.existsSync(BUILDPATH)) {
    throw new Error(`There is no directory with the name '${OPTS.builddir}' in your project.`);
  }

  const OUTPATH = `${CWD}/${OPTS.distdir}`;
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
    }
  }

  const OUTFILE = `${PACKAGE.name}_${PACKAGE.version}.zip`
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