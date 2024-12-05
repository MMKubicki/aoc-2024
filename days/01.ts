import { assertEquals } from "@std/assert";
import { join } from "@std/path";
import { consumeFileByLine } from "./util/file.ts";

export default async (fileRoot: string) => {
  // Parse
  const inputPath = join(fileRoot, "input.txt");

  const firstList: Array<number> = [];
  const secondList: Array<number> = [];

  await consumeFileByLine(inputPath, (line) => {
    const [first, second] = line.split(/\s+/).filter((s) =>
      s.trim().length > 0
    );
    firstList.push(parseInt(first));
    secondList.push(parseInt(second));
  });

  assertEquals(firstList.length, secondList.length);

  // Part 1

  const fistSorted = firstList.toSorted();
  const secondSorted = secondList.toSorted();

  const absDistance = (a: number, b: number): number => {
    const diff = b - a;
    if (diff < 0) {
      return diff * -1;
    }
    return diff;
  };

  const distSum = fistSorted
    .map((val, i) => absDistance(val, secondSorted[i]))
    .reduce((acc, curr) => acc + curr, 0);

  console.log("The distance is", distSum);

  // Part 2

  const cache = new Map<number, number>();
  secondList.map((num) => {
    const cached = cache.get(num);
    if (cached !== undefined) {
      cache.set(num, cached + 1);
    } else {
      cache.set(num, 1);
    }
  });
  const getValFromCache = (num: number): number => {
    const cached = cache.get(num);
    if (cached !== undefined) {
      return num * cached;
    }
    return 0;
  };

  const simSum = firstList.reduce(
    (acc, curr) => acc + getValFromCache(curr),
    0,
  );
  console.log("The similarity score is", simSum);
};
