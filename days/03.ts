import { join } from "@std/path";

export default async (fileRoot: string) => {
  // Parse
  const inputPath = join(fileRoot, "input.txt");
  const input = await Deno.readTextFile(inputPath);

  // const regex = /mul\((\d{1,3}),(\d{1,3})\)/gm; //old regex, look for "mul(", caputre the 1 to 3 digit numbers, comma in between and finished by )
  // new regex: look for two patterns
  //   1. pattern of old regex, but capture the mul in group "mul" and the numbers as "int1" and "int2"
  //   2. "do" with optional "n't" captured in group "enable" followed by "()"
  const regex =
    /((?<mul>mul)\((?<int1>\d{1,3}),(?<int2>\d{1,3})\))|(?<enable>(do(n't)?)\(\))/gm;
  const groups = Array.from(input.matchAll(regex));

  if (groups === null) {
    console.error("No instructions found");
    return;
  }

  // Part 1
  // Only collect groups with mul group
  // parse numbers, multiply and sum
  const mulSum = groups
    .filter((g) => g.groups && g.groups["mul"] !== undefined)
    .map<[number, number]>((
      g,
    ) => [parseInt(g.groups!["int1"]), parseInt(g.groups!["int2"])])
    .reduce((acc, [first, second]) => acc + (first * second), 0);
  console.log("Sum of mult:", mulSum);

  // Part 2
  // Go over all groups
  // Set mulEnable with "enable" group
  // On enabled and group has mul -> parse, multiply and sum
  let mulEnabled = true;
  let sum = 0;
  for (const g of groups) {
    if (!g.groups) {
      continue;
    }

    const action = g.groups["enable"];
    if (action !== undefined) {
      if (action === "do()") {
        mulEnabled = true;
      } else {
        mulEnabled = false;
      }
      continue;
    }

    if (mulEnabled && g.groups["mul"] === "mul") {
      sum += parseInt(g.groups["int1"]) * parseInt(g.groups["int2"]);
    }
  }

  console.log("Sum of mult with do/don't:", sum);
};
