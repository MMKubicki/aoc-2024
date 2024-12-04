import { join } from '@std/path';
import { consumeFileByLine } from './util/file.ts';

export default async (fileRoot: string) => {
    // Parse
    const inputPath = join(fileRoot, "input.txt");

    const field: Array<Array<string>> = [];

    await consumeFileByLine(inputPath, (line) => {
        field.push(line.split(""));
    });

    // Part 1
    const yLength = field.length;
    const xLength = field[0].length;

    let foundCount = 0;

    for (const [y, row] of field.entries()) {
        for (const [x, char] of row.entries()) {
            // only start check on X
            if (char !== "X") {
                continue;
            }

            // Left to right
            if (x+3 < xLength && [char, field[y][x+1], field[y][x+2], field[y][x+3]].join("") === "XMAS") {
                foundCount += 1;
            }

            // Right to left
            if (x-3 >= 0 && [char, field[y][x-1], field[y][x-2], field[y][x-3]].join("") === "XMAS") {
                foundCount += 1;
            }

            // Top down
            if (y+3 < yLength && [char, field[y+1][x], field[y+2][x], field[y+3][x]].join("") === "XMAS") {
                foundCount += 1;
            }

            // Bottom up
            if (y-3 >= 0 && [char, field[y-1][x], field[y-2][x], field[y-3][x]].join("") === "XMAS") {
                foundCount += 1;
            }

            // diagonal down right
            if (x+3 < xLength && y+3 < yLength && [char, field[y+1][x+1], field[y+2][x+2], field[y+3][x+3]].join("") === "XMAS") {
                foundCount += 1;
            }

            // diagonal top right
            if (x+3 < xLength && y-3 >= 0 && [char, field[y-1][x+1], field[y-2][x+2], field[y-3][x+3]].join("") === "XMAS") {
                foundCount += 1;
            }

            // diagonal top left
            if (x-3 >= 0 && y-3 >= 0 && [char, field[y-1][x-1], field[y-2][x-2], field[y-3][x-3]].join("") === "XMAS") {
                foundCount += 1;
            }

            // diagonal down left
            if (x-3 >= 0 && y+3 < yLength && [char, field[y+1][x-1], field[y+2][x-2], field[y+3][x-3]].join("") === "XMAS") {
                foundCount += 1;
            }
        }
    }

    console.log("Found XMAS:", foundCount);

    // Part 2

    let part2Count = 0;

    for (const [y, row] of field.entries()) {
        for (const [x, char] of row.entries()) {
            // Check from center, ignore outer rows and colums
            if (char !== "A" || y === 0 || x === 0 || y === yLength-1 || x === xLength-1) {
                continue
            }

            //Chain read fields to a string and compare
            //pattern
            //1.2
            //.3.
            //4.5
            const read = [field[y-1][x-1], field[y-1][x+1], char, field[y+1][x-1], field[y+1][x+1]].join("");

            //M.M
            //.A.
            //S.S
            if (read === "MMASS") {
                part2Count += 1;
            }

            //M.S
            //.A.
            //M.S
            if (read === "MSAMS") {
                part2Count += 1;
            }

            //S.S
            //.A.
            //M.M
            if (read === "SSAMM") {
                part2Count += 1;
            }

            //S.M
            //.A.
            //S.M
            if (read === "SMASM") {
                part2Count += 1;
            }
        }
    }

    console.log("Found X-MAS:", part2Count);

}