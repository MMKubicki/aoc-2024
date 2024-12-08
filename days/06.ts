import { join } from "@std/path";
import { consumeFileByLine } from "./util/file.ts";

type FieldInfo = boolean;
type SparseMap<U> = Map<number, Map<number, U>>;
// [Y, X]
type Coord = [number, number];
type Dir = "up" | "down" | "left" | "right";

function insertIntoMap<U>(
  map: SparseMap<U>,
  y: number,
  x: number,
  val: U,
): void {
  const yMap = map.get(y);
  if (typeof yMap !== "undefined") {
    yMap.set(x, val);
  } else {
    const newMap: Map<number, U> = new Map();
    newMap.set(x, val);
    map.set(y, newMap);
  }
}

function addToSetMap<U>(map: SparseMap<Set<U>>, [y, x]: Coord, val: U) {
  let set = extract(map, [y, x]);
  if (set === undefined) {
    set = new Set();
    insertIntoMap(map, y, x, set);
  }
  set.add(val);
}

function countMap<U>(map: SparseMap<U>): number {
  return map.entries()
    .map(([_, xMap]) => xMap.values().toArray().length)
    .reduce((acc, curr) => acc + curr, 0);
}

function extract<U>(map: SparseMap<U>, [y, x]: Coord): U | undefined {
  return map.get(y)?.get(x);
}

function isBlocked(map: SparseMap<FieldInfo>, pos: Coord): boolean {
  return extract(map, pos) ?? false;
}

function getDir(dir: Dir): Coord {
  switch (dir) {
    case "up":
      return [-1, 0];
    case "down":
      return [1, 0];
    case "left":
      return [0, -1];
    case "right":
      return [0, 1];
  }
}

function turnRight(dir: Dir): Dir {
  switch (dir) {
    case "up":
      return "right";
    case "down":
      return "left";
    case "left":
      return "up";
    case "right":
      return "down";
  }
}

function addCoord([y1, x1]: Coord, [y2, x2]: Coord): Coord {
  return [y1 + y2, x1 + x2];
}

export default async (fileRoot: string) => {
  // Parse
  const inputPath = join(fileRoot, "input.txt");

  const map: SparseMap<FieldInfo> = new Map();
  let playerPos: Coord = [0, 0];
  let playerDir: Dir = "up";
  let maxX = 0;
  let maxY = 0;

  await consumeFileByLine(inputPath, (line, y) => {
    line.split("").forEach((char, i) => {
      const potentialPos: Coord = [y, i];
      switch (char) {
        case ".": // empty
          if (i > maxX) {
            maxX = i;
          }
          return;
        case "#": // obstruction
          insertIntoMap(map, y, i, true);
          return;
        case "^":
          playerPos = potentialPos;
          playerDir = "up";
          return;
        case "v":
          playerPos = potentialPos;
          playerDir = "down";
          return;
        case ">":
          playerPos = potentialPos;
          playerDir = "right";
          return;
        case "<":
          playerPos = potentialPos;
          playerDir = "left";
          return;
        default:
          console.error("Unknown char:", char);
      }
    });
    if (y > maxY) {
      maxY = y;
    }
  });

  // console.log("Map:\n", map, "\nPlayerPos:", playerPos, "\nDir:", playerDir);
  // Part 1

  // returns visited tiles and bool true if loop detected
  function runMap(
    map: SparseMap<boolean>,
    playerPos: Coord,
    startDir: Dir,
  ): [SparseMap<Set<Dir>>, boolean] {
    const visited: SparseMap<Set<Dir>> = new Map();
    let currentPos = playerPos;
    let currentDir: Dir = startDir;

    while (true) {
      const [y, x] = currentPos;
      if (y < 0 || x < 0 || y > maxY || x > maxX) {
        return [visited, false]; // Left map -> done
      }
      addToSetMap(visited, [y, x], currentDir);
      const dir = getDir(currentDir);
      const newPos = addCoord(currentPos, dir);

      if (isBlocked(map, newPos)) {
        currentDir = turnRight(currentDir);
      } else {
        currentPos = newPos;
      }
    }
  }

  const [visited, looping] = runMap(map, playerPos, playerDir);

  if (looping) {
    console.error("Loop detected");
  }

  const count = countMap(visited);
  console.log("Visited postions:", count);

  // Part 2
  // TODO
};
