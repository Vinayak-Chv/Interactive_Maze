// src/logic/dijkstra.ts
import { Grid, Position, Step } from "../types";

export const dijkstra = (grid: Grid, start: Position, end: Position): Step[] => {
  const rows = grid.length;
  const cols = grid[0].length;
  const steps: Step[] = [];

  const encode = (p: Position) => `${p.row},${p.col}`;

  const dist: Map<string, number> = new Map();
  const prev: Map<string, Position | null> = new Map();
  const unvisited: Position[] = [];
  const inQueue: Set<string> = new Set();

  // Initialize all reachable cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0) {
        const pos: Position = { row: r, col: c };
        const k = encode(pos);
        dist.set(k, Infinity);
        prev.set(k, null);
      }
    }
  }

  dist.set(encode(start), 0);
  unvisited.push(start);
  inQueue.add(encode(start));

  steps.push({ type: "PUSH", row: start.row, col: start.col, stack: [start] });

  const dirs: [number, number][] = [[-1, 0], [0, 1], [1, 0], [0, -1]];

  while (unvisited.length > 0) {
    // Pick the unvisited node with smallest dist
    let bestIdx = 0;
    for (let i = 1; i < unvisited.length; i++) {
      const bd = dist.get(encode(unvisited[bestIdx])) ?? Infinity;
      const cd = dist.get(encode(unvisited[i])) ?? Infinity;
      if (cd < bd) bestIdx = i;
    }
    const cur = unvisited.splice(bestIdx, 1)[0];
    inQueue.delete(encode(cur));

    if (dist.get(encode(cur)) === Infinity) break; // remaining unreachable

    if (cur.row === end.row && cur.col === end.col) {
      // Reconstruct path
      const path: Position[] = [];
      let node: Position | null = cur;
      while (node) {
        path.unshift(node);
        node = prev.get(encode(node)) ?? null;
      }
      steps.push({ type: "FOUND", row: cur.row, col: cur.col, stack: path });
      return steps;
    }

    steps.push({ type: "POP", row: cur.row, col: cur.col, stack: [...unvisited] });

    for (const [dr, dc] of dirs) {
      const r = cur.row + dr;
      const c = cur.col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
      if (grid[r][c] === 1) continue;
      const neighbor: Position = { row: r, col: c };
      const nk = encode(neighbor);
      const alt = (dist.get(encode(cur)) ?? Infinity) + 1;
      if (alt < (dist.get(nk) ?? Infinity)) {
        dist.set(nk, alt);
        prev.set(nk, cur);
        if (!inQueue.has(nk)) {
          unvisited.push(neighbor);
          inQueue.add(nk);
          steps.push({ type: "PUSH", row: r, col: c, stack: [...unvisited] });
        }
      }
    }
  }

  steps.push({ type: "NO_PATH", row: -1, col: -1, stack: [] });
  return steps;
};
