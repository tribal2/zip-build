import inquirer from "inquirer";
import { mocked } from "ts-jest/dist/utils/testing";

import confirmAsync from "./confirmAsync";

jest.mock("inquirer");

test('Should return true', async () => {
  mocked(inquirer).prompt.mockResolvedValueOnce({ qname: true });

  const result = await confirmAsync('', true);
  expect(result).toBe(true);
});

test('Should return false', async () => {
  mocked(inquirer).prompt.mockResolvedValueOnce({ qname: false });

  const result = await confirmAsync('', true);
  expect(result).toBe(false);
});
