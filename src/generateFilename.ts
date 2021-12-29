import os from 'os';
import { TFormat } from './index';

const CWD = process.cwd();
const PACKAGE = require(`${CWD}/package.json`);

export default function generateFilename(
  template: string,
  extension: TFormat,
): string {
  let filename = template;

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
    const now = new Date();

    let timestamp = now.toISOString()   // '2021-12-29T15:23:47.803Z'
      .slice(0, -5);                    // '2021-12-29T15:23:47'

    if (os.platform() === 'win32') {
      const nowParts = timestamp
        .split('T');                    // [ '2021-12-29', '15:23:47' ]

      const date = nowParts[0];         // '2021-12-29'

      const [ hour, min, sec ] =
        nowParts[1]                     // '15:23:47'
          .split(':');                  // [ '15', '23', '47' ]

      timestamp = `${date}T${hour}h${min}m${sec}s`; //
      filename = filename.replace('%TIMESTAMP%', timestamp);
    }
  }

  filename = filename.replace('%EXT%', extension);

  return filename;
}
