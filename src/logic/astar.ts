// src/logic/astar.ts
import { Grid, Position, Step } from "../types";

const heuristic = (a: Position, b: Position): number =>
  Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

export const astar = (grid: Grid, start: Position, end: Position): Step[] => {
  const rows = grid.length;
  const cols = grid[0].length;
  const steps: Step[] = [];

  const encode = (p: Position) => `${p.row},${p.col}`;

  const gScore: Map<string, number> = new Map();
  const fScore: Map<string, number> = new Map();
  const cameFrom: Map<string, Position | null> = new Map();
  const openSet: Position[] = [];
  const inOpen: Set<string> = new Set();
  const closedSet: Set<string> = new Set();

  gScore.set(encode(start), 0);
  fScore.set(encode(start), heuristic(start, end));
  openSet.push(start);
  inOpen.add(encode(start));
  cameFrom.set(encode(start), null);

  steps.push({ type: "PUSH", row: start.row, col: start.col, stack: [start] });

  const dirs: [number, number][] = [[-1, 0], [0, 1], [1, 0], [0, -1]];

  while (openSet.length > 0) {
    // Pick node with lowest fScore
    let bestIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      const bf = fScore.get(encode(openSet[bestIdx])) ?? Infinity;
      const cf = fScore.get(encode(openSet[i])) ?? Infinity;
      if (cf < bf) bestIdx = i;
    }
    const cur = openSet.splice(bestIdx, 1)[0];
    inOpen.delete(encode(cur));
    closedSet.add(encode(cur));

    if (cur.row === end.row && cur.col === end.col) {
      // Reconstruct path
      const path: Position[] = [];
      let node: Position | null = cur;
      while (node) {
        path.unshift(node);
        node = cameFrom.get(encode(node)) ?? null;
      }
      steps.push({ type: "FOUND", row: cur.row, col: cur.col, stack: path });
      return steps;
    }

    // Dequeue analogue
    steps.push({ type: "POP", row: cur.row, col: cur.col, stack: [...openSet] });

    for (const [dr, dc] of dirs) {
      const r = cur.row + dr;
      const c = cur.col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
      if (grid[r][c] === 1) continue;
      const neighbor: Position = { row: r, col: c };
      const nk = encode(neighbor);
      if (closedSet.has(nk)) continue;

      const tentativeG = (gScore.get(encode(cur)) ?? Infinity) + 1;
      if (tentativeG < (gScore.get(nk) ?? Infinity)) {
        cameFrom.set(nk, cur);
        gScore.set(nk, tentativeG);
        fScore.set(nk, tentativeG + heuristic(neighbor, end));
        if (!inOpen.has(nk)) {
          openSet.push(neighbor);
          inOpen.add(nk);
          steps.push({ type: "PUSH", row: r, col: c, stack: [...openSet] });
        }
      }
    }
  }

  steps.push({ type: "NO_PATH", row: -1, col: -1, stack: [] });
  return steps;
};
