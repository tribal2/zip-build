import getTimestampString from "../getTimestampString";

const NIX_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/;
const WIN_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}h[0-9]{2}m[0-9]{2}s$/;

test('Generate timestamp for Windows platform filename', () => {
  expect(getTimestampString('win32'))
    .toMatch(WIN_REGEX);
});

test('Generate timestamp for other than windows platform filename', () => {
  expect(getTimestampString('linux'))
    .toMatch(NIX_REGEX);
});
