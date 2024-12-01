import { Command } from '@cliffy/command';
import { join } from '@std/path';

await new Command()
    .name("deno run main.ts")
    .arguments("<day:integer>")
    .usage("<day>")
    .example(
        "Run day 1",
        "deno run main.ts 1"
    )
    .action(async (_options, ...[day]) => {
        const dayStr = day < 10 ? `0${day}` : `${day}`;
        const tempRoot = join(import.meta.dirname ?? ".", ".aoc", dayStr);
        const loadPath = `./days/${dayStr}.ts`;

        const {
            default: runDay,
        } = await import(loadPath);
        await runDay(tempRoot);
    })
    .parse(Deno.args)
