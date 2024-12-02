import { join } from '@std/path';
import { consumeFileByLine } from './util/file.ts';

export default async (fileRoot: string) => {
    // Parse
    const inputPath = join(fileRoot, "input.txt");

    const reports: Array<Array<number>> = [];

    await consumeFileByLine(inputPath, (line) => {
        const report = line
            .split(/\s+/)
            .filter((s) => s.length > 0)
            .map((s) => parseInt(s))
        reports.push(report);
    });

    // Part 1
    // report needs to be increasing or decreasing in itself
    // min step 1; max step 3

    // calc step
    const diff = (a: number, b: number): number => 
        b - a;

    const abs = (num: number): number => 
        num < 0 ? num * -1 : num;

    // identify step direction, by step
    const identifyDir = (num: number): 'inc' | 'dec' | undefined => {
        if (num < 0) {
            return 'dec';
        }
        if (num > 0) {
            return 'inc';
        }
        return undefined;
    };

    const isSafe = (report: Array<number>): boolean => {
        let last: number | undefined = undefined
        let dir: 'inc' | 'dec' | undefined = undefined
        for (const entry of report) {
            if (last == undefined) {
                last = entry;
                continue;
            }

            // identify step directin
            if (dir == undefined) {
                dir = identifyDir(diff(entry, last))
                if (dir == undefined) { // No change/step in beginning -> unsafe
                    return false;
                }
            }

            // step needs to be:
            // 1 <= step <= 3
            const step = diff(entry, last);
            last = entry;

            // Change larger than 3 -> unsafe
            if (abs(step) > 3) {
                return false;
            }

            // Changed between inc and dec, or no change at all -> unsafe
            if (identifyDir(step) != dir) {
                return false;
            }
        }
        return true;
    };

    const tagged = reports.map<[Array<number>, boolean]>((r) => [r, isSafe(r)]);
    
    const itselfSafe = tagged.filter(([_r, safe]) => safe);
    const safeCount = itselfSafe.length;
    console.log("Number of safe reports:", safeCount);

    // Part 2
    // one number from usafe is removable, check if possible to be safe

    // Iterate over reports itself unsafe
    // go over every index of report and check if removed if safe
    // if one results in safe -> is safeable
    const itselfUnsafe = tagged.filter(([_r, safe]) => !safe);
    const safeable = itselfUnsafe.filter(([report, _safe]) =>
        report.some((_v, i) => {
            const toCheck = report.toSpliced(i, 1);
            return isSafe(toCheck);
        })
    );

    // add itself safe counts and safeable counts
    const totalSafeCount = safeCount + safeable.length;
    console.log("Number of safe reports with problem dampner:", totalSafeCount)
}