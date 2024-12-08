import { join } from "@std/path";
import { consumeFileByLine } from "./util/file.ts";
import { assertEquals } from "@std/assert/equals";

type CalibrationInput = {
  result: number;
  parts: Array<number>;
};

type CheckCbType = (
  result: number,
  acc: number,
  rest: Array<number>,
  func: CheckCbType,
) => boolean;
type OpsList = Array<CheckCbType>;

function metaCheck(ops: OpsList): CheckCbType {
  const func: CheckCbType = (result, acc, rest) => {
    if (rest.length === 0) {
      return result === acc;
    }

    return ops.some((op) => op(result, acc, rest, func));
  };

  return func;
}

function metaCheckOp(cb: (acc: number, next: number) => number): CheckCbType {
  return (result, acc, rest, func) => {
    const [next, ...newRest] = rest;
    return func(result, cb(acc, next), newRest, func);
  };
}

const checkMul = metaCheckOp((acc, next) => acc * next);
const checkAdd = metaCheckOp((acc, next) => acc + next);
const checkConcat = metaCheckOp((acc, next) =>
  parseInt(acc.toString() + next.toString())
);

const checkPart1 = metaCheck([checkMul, checkAdd]);
const checkPart2 = metaCheck([checkMul, checkAdd, checkConcat]);

function part1(c: CalibrationInput): boolean {
  const [acc, ...rest] = c.parts;
  return checkPart1(c.result, acc, rest, checkPart1);
}

function part2(c: CalibrationInput): boolean {
  const [acc, ...rest] = c.parts;
  return checkPart2(c.result, acc, rest, checkPart2);
}

export default async (fileRoot: string) => {
  // Parse
  const inputPath = join(fileRoot, "input.txt");

  const input: Array<CalibrationInput> = [];

  await consumeFileByLine(inputPath, (line) => {
    const resPartSplit = line.split(": ");
    assertEquals(resPartSplit.length, 2);
    const result = parseInt(resPartSplit[0]);
    const partsStr = resPartSplit[1].split(" ");
    const parts = partsStr.map((s) => parseInt(s));
    input.push({
      result,
      parts,
    });
  });

  // Part 1
  const part1Result = input.filter((i) => part1(i)).reduce(
    (acc, curr) => acc + curr.result,
    0,
  );
  console.log("Total calibration result 1:", part1Result);

  // Part 2
  const part2Result = input.filter((i) => part2(i)).reduce(
    (acc, curr) => acc + curr.result,
    0,
  );
  console.log("Total calibration result 2:", part2Result);
};
