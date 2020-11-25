#!/usr/bin/env node
const fs = require('fs');
const zipFolder = require('zip-folder');

const DEFAULTS = {
  builddir: 'build',
  distdir: 'dist',
};

const CWD = process.cwd();
const PACKAGE = require(`${CWD}/package.json`);
const OPTS = PACKAGE.zipfolder || DEFAULTS;

console.log(PACKAGE.name, PACKAGE.version);

const BUILDPATH = `${CWD}/${OPTS.builddir}`;
if (!fs.existsSync(BUILDPATH)) {
  throw new Error(`There is no directory with the name '${OPTS.builddir}' in your project.`);
}

const OUTPATH = `${CWD}/${OPTS.distdir}`;
if (!fs.existsSync(OUTPATH)) {
  fs.mkdirSync(OUTPATH);
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