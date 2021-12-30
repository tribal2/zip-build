import inquirer, { Answers, QuestionCollection } from "inquirer";

export default async function userConfirmAsync(
  message: string,
  _default = true
): Promise<any> {
  const questions: QuestionCollection<Answers> = [{
    type: 'confirm',
    name: 'qname',
    message,
    default: _default,
  }];

  const answerObj = await inquirer.prompt(questions);

  return answerObj.qname;
}
