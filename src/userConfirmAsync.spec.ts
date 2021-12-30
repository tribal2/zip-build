import inquirer from "inquirer";
import { mocked } from "ts-jest/dist/utils/testing";

import userConfirmAsync from "./userConfirmAsync";

jest.mock("inquirer");

test('Should return true', async () => {
  mocked(inquirer).prompt.mockResolvedValueOnce({ qname: true });

  const result = await userConfirmAsync('', true);
  expect(result).toBe(true);
});

test('Should return false', async () => {
  mocked(inquirer).prompt.mockResolvedValueOnce({ qname: false });

  const result = await userConfirmAsync('', true);
  expect(result).toBe(false);
});
