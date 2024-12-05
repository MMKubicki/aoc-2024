import { TextLineStream } from "@std/streams";

export async function consumeFileByLine(
  path: string | URL,
  callback: (line: string) => void,
): Promise<void> {
  const file = await Deno.open(path, { read: true });
  const lineWriter = new WritableStream({
    write: callback,
  });

  await file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())
    .pipeTo(lineWriter);
}
