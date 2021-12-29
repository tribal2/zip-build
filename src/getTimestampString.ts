import os from "os";

export default function getTimestampString(
  osPlatform: NodeJS.Platform = os.platform(),
): string {
  const now = new Date();

  let timestamp = now.toISOString()   // '2021-12-29T15:23:47.803Z'
    .slice(0, -5);                    // '2021-12-29T15:23:47'

  if (osPlatform === 'win32') {
    const nowParts = timestamp
      .split('T');                    // [ '2021-12-29', '15:23:47' ]

    const date = nowParts[0];         // '2021-12-29'

    const [ hour, min, sec ] =
      nowParts[1]                     // '15:23:47'
        .split(':');                  // [ '15', '23', '47' ]

    timestamp = `${date}T${hour}h${min}m${sec}s`; //
  }

  return timestamp;
}
