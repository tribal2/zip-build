#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const handler = require('./handler');

function builder(yargs) {
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
    .option('f', {
      alias: 'format',
      type: 'string',
      description: 'Format of output file',
      choices: [
        'zip',
        'tar',
      ],
      default: 'zip',
    })
    .option('n', {
      alias: 'name',
      type: 'boolean',
      description: 'Ask for output archive filename',
      default: false,
    })
    .option('t', {
      alias: 'template',
      type: 'string',
      description: 'Template for output archive filename',
      default: '%NAME%_%VERSION%_%TIMESTAMP%.%EXT%',
    })
    .example('$0', "Zip 'build' directory and put archive under dist directory.")
    .example('$0 out backup', "Zip 'out' directory and put archive under backup directory.")
}

yargs(hideBin(process.argv))
  .command(
    '$0 [build-dir] [zip-dir] [options]',
    'Zip your <build-dir> directory into <zip-dir>',
    builder,
    handler
  )
  .help('h')
  .alias('h', 'help')
  .argv;
