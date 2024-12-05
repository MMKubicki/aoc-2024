import { join } from '@std/path';
import { consumeFileByLine } from './util/file.ts';
import { assertEquals } from "@std/assert/equals";

export default async (fileRoot: string) => {
    // Parse
    const inputPath = join(fileRoot, "input.txt");

    const rules: Map<number, Array<[number, number]>> = new Map();
    const pages: Array<Array<number>> = [];

    const insertIntoRulemap = (ruleMap: Map<number, Array<[number, number]>>, at: number, rule: [number, number]): void => {
        const inMap = ruleMap.get(at);
        if (inMap) {
            inMap.push(rule);
        } else {
            ruleMap.set(at, [rule]);
        }
    }

    let finishedRules = false;
    await consumeFileByLine(inputPath, (line) => {
        if (!finishedRules) {
            if (line.length === 0) {
                finishedRules = true;
                return;
            }

            // parse rules and put into map

            const numbers = line.split("|").map((s) => parseInt(s));
            assertEquals(numbers.length, 2);
            const rule: [number, number] = [numbers[0], numbers[1]];
            insertIntoRulemap(rules, numbers[0], rule);
            insertIntoRulemap(rules, numbers[1], rule);
            return;
        }

        // parse pages

        const page = line.split(",").map((s) => parseInt(s));
        pages.push(page);
    });
    // Part 1

    const satisfiesRules = (ruleMap: Map<number, Array<[number, number]>>, page: Array<number>): boolean =>
        // use set to make rules unique
        new Set(
                ruleMap
                    .entries()
                    // use only rules containing num from page, by map key
                    .filter(rule => page.includes(rule[0]))
                    // use only rules only containing num from page
                    .flatMap(([_num, rules]) => 
                        rules.filter(([r1, r2]) => page.includes(r1) && page.includes(r2))
                    )
            )
            .values()
            // for every rule, index of numbers must be ordered
            .every(([num1, num2]) => page.indexOf(num1) < page.indexOf(num2));

    const orderedPages: Array<Array<number>> = [];
    const unorderedPages: Array<Array<number>> = [];

    // partition by rule satisfaction
    for (const page of pages) {
        if (satisfiesRules(rules, page)) {
            orderedPages.push(page);
        } else {
            unorderedPages.push(page);
        }
    }

    const getMiddle = (inp: Array<number>): number =>
        inp[Math.floor(inp.length/2)];

    // sum up middles
    const part1Sum = orderedPages.map(getMiddle).reduce((acc, curr) => acc + curr, 0);

    console.log("Sum of middle of ordered pages:", part1Sum);

    // Part 2

    const orderPage = (ruleMap: Map<number, Array<[number, number]>>, page: Array<number>): Array<number> => {
        // reduce rules to those with numbers in page
        const currentRules = new Map(
            ruleMap
                    .entries()
                    .filter(([num, _rules]) => page.includes(num))
                    .map(([num, rules]) => 
                        [num, rules.filter(([r1, r2]) => page.includes(r1) && page.includes(r2))]
                    )
                );

        // use default sort, search for rules containing both numbers
        // and apply if found. else equal value
        return page.sort((a, b) => {
            // test a
            const aRules = currentRules.get(a);
            if (aRules) {
                const aWithB = aRules.find(([num1, num2]) => num1 === b || num2 === b);
                if (aWithB) {
                    return aWithB[0] === a ? -1 : 1;
                }
            }

            const bRules = currentRules.get(b);
            if (bRules) {
                const bWithA = bRules.find(([num1, num2]) => num1 === a || num2 === a);
                if (bWithA) {
                    return bWithA[0] === b ? 1 : -1;
                }
            }

            return 0;
        })
    };

    const part2Sum = unorderedPages.map((p) => orderPage(rules, p)).map(getMiddle).reduce((acc, curr) => acc + curr, 0);

    console.log("Sum of middle of ordered unordered pages", part2Sum);
}