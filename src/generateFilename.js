const CWD = process.cwd();
const PACKAGE = require(`${CWD}/package.json`);

exports.generateFilename = function(template, extension) {
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

  filename = filename.replace('%EXT%', extension);

  return filename;
}
