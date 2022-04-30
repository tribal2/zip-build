import { Arguments } from 'yargs';
import { ZipBuildFormat } from './ZipBuildFormat';

export interface IZipBuildArguments extends Arguments {
  buildDir: string;
  zipDir: string;
  format: ZipBuildFormat;
  name: boolean;
  template: string;
}
