const fs = require('fs');
const inquirer = require('inquirer');

async function setBackupName(dstdir, filename, format) {
  const OUTPATH = `${process.cwd()}/${dstdir}`;
  const URI = `${OUTPATH}/${filename}`;

  if (! fs.existsSync(URI)) return filename;

  const choices = [
    'Rename output file appending the current timestamp',
    'Rename output file with another name',
    'Overwrite existing file',
    'Exit'
  ];

  const MSG = `The file '${filename}' already exists in directory `
    + `'${dstdir}'.. What do you want to do?`
  const ANS = await inquirer.prompt([{
    type: 'list',
    name: 'qname',
    message: MSG,
    choices,
  }]);

  switch (ANS.qname) {
    case choices[0]:
      const now = new Date();
      const timestamp = now.toISOString().slice(0, -5); // eg: 2021-03-27T04:17:04
      filename = filename.replace(/(\.[\w\d_-]+)$/i, `_${timestamp}$1`);
      return await setBackupName(dstdir, filename, format);

    case choices[1]:
      const ANS_REN = await inquirer.prompt([{
        type: 'input',
        name: 'filename',
        message: 'New name for your file:',
      }]);
      return await setBackupName(dstdir, `${ANS_REN.filename}.${format}`, format);

    case choices[2]:
      return filename;

    default:
      console.log('Bye!');
      process.exit(0);
  }
}

exports.setBackupName = setBackupName;
