import { Arguments } from 'yargs';
import { ZipBuildFormat } from './ZipBuildFormat';

export interface IZipBuildArguments extends Arguments {
  buildDir: string;
  zipDir: string;
  interactive: boolean;
  format: ZipBuildFormat;
  name: boolean;
  template: string;
}
