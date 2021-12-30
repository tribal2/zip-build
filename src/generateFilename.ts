import os from 'os';
import { TFormat } from './index';
import getTimestampString from './getTimestampString';

const CWD = process.cwd();
const PACKAGE = require(`${CWD}/package.json`);

export default function generateFilename(
  template: string,
  extension: TFormat,
  osPlatform: NodeJS.Platform = os.platform(),
): string {
  let filename = template || '%NAME%_%VERSION%_%TIMESTAMP%.%EXT%';

  for (const key in PACKAGE) {
    if (PACKAGE.hasOwnProperty(key)) {
      const keyPlaceholder = `%${key.toUpperCase()}%`; // name --> %NAME%
      const parsedVal = PACKAGE[key]
        .toString()                         // convert non-strings to strings
        .replace(/[^a-z0-9\s\._-]/gi, '')   // remove illegal filename chars
        .replace(/[\s]/g, '_');             // convert spaces to underscores

      filename = filename.replace(keyPlaceholder, parsedVal);
    }
  }

  if (filename.includes('%TIMESTAMP%')) {
    const timestamp = getTimestampString(osPlatform);
    filename = filename.replace('%TIMESTAMP%', timestamp);
  }

  filename = filename.replace('%EXT%', extension);

  return filename;
}
