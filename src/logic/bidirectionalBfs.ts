
import { Grid, Position, Step } from "../types";

/**
 * Bidirectional Breadth-First Search.
 * Searches simultaneously from the start and end positions.
 * PUSH/POP events include a direction flag.
 */
export const bidirectionalBfs = (
  grid: Grid,
  start: Position,
  end: Position,
): Step[] => {
  const rows = grid.length;
  const cols = grid[0].length;
  const encode = (p: Position) => `${p.row},${p.col}`;

  // Handle start and end being the same cell
  if (start.row === end.row && start.col === end.col) {
    return [
      {
        type: "FOUND",
        row: start.row,
        col: start.col,
        stack: [start],
      },
    ];
  }

  // Visited matrices for both search directions
  const visitedF: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false),
  );

  const visitedB: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false),
  );

  // Parent maps for path reconstruction
  const parentF = new Map<string, Position | null>();
  const parentB = new Map<string, Position | null>();

  // BFS queues
  const queueF: Position[] = [];
  const queueB: Position[] = [];

  const steps: Step[] = [];

  // Initialize forward search
  visitedF[start.row][start.col] = true;
  parentF.set(encode(start), null);
  queueF.push(start);

  steps.push({
    type: "PUSH",
    row: start.row,
    col: start.col,
    stack: [start],
    direction: "forward",
  });

  // Initialize backward search
  visitedB[end.row][end.col] = true;
  parentB.set(encode(end), null);
  queueB.push(end);

  steps.push({
    type: "PUSH",
    row: end.row,
    col: end.col,
    stack: [end],
    direction: "backward",
  });

  const dirs: [number, number][] = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  // Stores the two cells where searches meet
  type Meeting = {
    f: Position;
    b: Position;
  };

  let meeting: Meeting | null = null;

  // Record PUSH events and check for a meeting
  const recordPush = (
    pos: Position,
    direction: "forward" | "backward",
    otherVisited: boolean[][],
  ) => {
    steps.push({
      type: "PUSH",
      row: pos.row,
      col: pos.col,
      stack: [pos],
      direction,
    });

    // Same-cell meeting
    if (otherVisited[pos.row][pos.col]) {
      meeting = { f: pos, b: pos };
      return;
    }

    // Adjacent-cell meeting
    for (const [dr, dc] of dirs) {
      const nr = pos.row + dr;
      const nc = pos.col + dc;

      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) {
        continue;
      }

      if (otherVisited[nr][nc]) {
        if (direction === "forward") {
          meeting = {
            f: pos,
            b: { row: nr, col: nc },
          };
        } else {
          meeting = {
            f: { row: nr, col: nc },
            b: pos,
          };
        }

        return;
      }
    }
  };

  // Explicitly typed accessor prevents TypeScript's never narrowing issue
  const getMeeting = (): Meeting | null => meeting;

  // Expand one complete BFS layer
  const expandLayer = (
    queue: Position[],
    visited: boolean[][],
    otherVisited: boolean[][],
    parentMap: Map<string, Position | null>,
    direction: "forward" | "backward",
  ) => {
    const layerSize = queue.length;

    for (let i = 0; i < layerSize && getMeeting() === null; i++) {
      const cur = queue.shift()!;

      for (const [dr, dc] of dirs) {
        const r = cur.row + dr;
        const c = cur.col + dc;

        if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
        if (grid[r][c] === 1) continue;
        if (visited[r][c]) continue;

        const pos: Position = { row: r, col: c };

        visited[r][c] = true;
        parentMap.set(encode(pos), cur);
        queue.push(pos);

        recordPush(pos, direction, otherVisited);

        if (getMeeting() !== null) break;
      }

      steps.push({
        type: "POP",
        row: cur.row,
        col: cur.col,
        stack: [],
        direction,
      });
    }
  };

  // Alternate complete BFS layers
  while (
    queueF.length > 0 &&
    queueB.length > 0 &&
    getMeeting() === null
  ) {
    expandLayer(queueF, visitedF, visitedB, parentF, "forward");

    if (getMeeting() !== null) break;

    expandLayer(queueB, visitedB, visitedF, parentB, "backward");
  }

  // Get the meeting information
  const foundMeeting = getMeeting();

  // No path exists
  if (foundMeeting === null) {
    steps.push({
      type: "NO_PATH",
      row: -1,
      col: -1,
      stack: [],
    });

    return steps;
  }

  // Reconstruct path from start to forward meeting cell
  const forwardPath: Position[] = [];
  let nodeF: Position | null = foundMeeting.f;

  while (nodeF) {
    forwardPath.unshift(nodeF);
    nodeF = parentF.get(encode(nodeF)) ?? null;
  }

  // Reconstruct path from backward meeting cell to end
  const backwardPath: Position[] = [];
  let nodeB: Position | null = foundMeeting.b;

  while (nodeB) {
    backwardPath.push(nodeB);
    nodeB = parentB.get(encode(nodeB)) ?? null;
  }

  // Join both paths without duplicating the meeting cell
  const sameMeetingCell =
    foundMeeting.f.row === foundMeeting.b.row &&
    foundMeeting.f.col === foundMeeting.b.col;

  const fullPath = sameMeetingCell
    ? forwardPath.concat(backwardPath.slice(1))
    : forwardPath.concat(backwardPath);

  // Emit the final path
  steps.push({
    type: "FOUND",
    row: foundMeeting.f.row,
    col: foundMeeting.f.col,
    stack: fullPath,
  });

  return steps;
};
