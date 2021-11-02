import inquirer = require('inquirer');

export default async function confirmAsync(message: string, _default = true) {
  const questions = [{
    type: 'confirm',
    name: 'qname',
    message,
    default: _default,
  }];

  const answerObj = await inquirer.prompt(questions);
  return answerObj.qname;
}
