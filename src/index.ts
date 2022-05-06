#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { Arguments, Argv } from 'yargs';

import handler from './handler';

const formats = ['zip', 'tar'] as const;
export type TFormat = typeof formats[number];

export interface IArguments extends Arguments {
  buildDir: string;
  zipDir: string;
  format: TFormat;
  name: boolean;
  template: string;
  subDir: string;
}

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
    .option('format', {
      alias: 'f',
      type: 'string',
      description: 'Format of output file',
      choices: formats,
      default: formats[0],
    })
    .option('name', {
      alias: 'n',
      type: 'boolean',
      description: 'Ask for output archive filename',
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
    .example('$0', "Zip 'build' directory and put archive under dist directory.")
    .example('$0 out backup', "Zip 'out' directory and put archive under backup directory.");
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
