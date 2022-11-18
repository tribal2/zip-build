#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { Argv } from 'yargs';
import { ZipBuildFormat } from './@types/ZipBuildFormat';

import handler from './handler';

function builder(yargs: Argv) {
  return yargs
    .usage('Usage: $0 <build-dir> <zip-dir> [options]')
    .positional('buildDir', {
      describe: 'Directory of your build output',
      default: 'build'
    })
    .positional('zipDir', {
      describe: 'Directory for your zipped backup',
      default: 'dist'
    })
    .option('interactive', {
      alias: 'i',
      type: 'boolean',
      description: 'Enable interactive mode',
      default: false,
    })
    .option('format', {
      alias: 'f',
      type: 'string',
      description: 'Format of output file',
      choices: Object.values(ZipBuildFormat),
      default: ZipBuildFormat.ZIP,
    })
    .option('name', {
      alias: 'n',
      type: 'boolean',
      description: 'Ask for output archive filename (requires flag --interactive)',
      default: false,
    })
    .option('template', {
      alias: 't',
      type: 'string',
      description: 'Template for output archive filename',
      default: '%NAME%_%VERSION%_%TIMESTAMP%.%EXT%',
    })
    .option('subDir', {
      alias: 's',
      type: 'string',
      description: 'Creates a sub directory to put all files',
      default: '',
    })
    .option('override', {
      alias: 'o',
      type: 'boolean',
      description: 'Override the output file if it already exists',
      default: false,
    })
    .example([
      [
        '$0',
        'Zip <build> directory and put archive under <dist> directory.',
      ],
      [
        '$0 out backup',
        'Zip <out> directory and put archive under <backup> directory.',
      ],
      [
        '$0 out backup -f tar',
        'Archive <out> directory and put archive under <backup> directory compressed with Tar.',
      ],
    ]);
}

yargs(hideBin(process.argv))
  .command({
    command: '$0 [buildDir] [zipDir] [options]',
    describe: 'Zip your <build-dir> directory into <zip-dir>',
    builder,
    handler
  })
  .help('h')
  .alias('h', 'help')
  .argv;
