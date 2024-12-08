import { TextLineStream } from "@std/streams";

export async function consumeFileByLine(
  path: string | URL,
  callback: (line: string, i: number) => void,
): Promise<void> {
  let counter = 0;
  const file = await Deno.open(path, { read: true });
  const lineWriter = new WritableStream({
    write: (line: string) => {
      callback(line, counter);
      counter += 1;
    },
  });

  await file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())
    .pipeTo(lineWriter);
}
