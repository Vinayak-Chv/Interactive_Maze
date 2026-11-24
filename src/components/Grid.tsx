// src/components/Grid.tsx
import { Grid, Position, Tool, Step } from "../types";
import { useState, useEffect } from "react";

type Props = {
  grid: Grid;
  start: Position;
  end: Position;
  tool: Tool;
  onUpdate: (row: number, col: number, newCell: number) => void;
  onSetStart: (pos: Position) => void;
  onSetEnd: (pos: Position) => void;
  disabled: boolean;
  steps: Step[];
  stepIdx: number;
};

export const GridComponent = ({
  grid,
  start,
  end,
  tool,
  onUpdate,
  onSetStart,
  onSetEnd,
  disabled,
  steps,
  stepIdx,
}: Props) => {
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const up = () => setMouseDown(false);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const handleCell = (r: number, c: number) => {
    if (disabled) return;

    if (tool === "start") {
      if (grid[r][c] === 0 && !(r === end.row && c === end.col)) {
        onSetStart({ row: r, col: c });
      }
    } else if (tool === "end") {
      if (grid[r][c] === 0 && !(r === start.row && c === start.col)) {
        onSetEnd({ row: r, col: c });
      }
    } else {
      if ((r === start.row && c === start.col) || (r === end.row && c === end.col)) return;
      const newVal = tool === "wall" ? 1 : 0;
      if (grid[r][c] !== newVal) onUpdate(r, c, newVal);
    }
  };

  // Build visited sets from steps
  const visited = new Set<string>();
  const forwardVisited = new Set<string>();
  const backwardVisited = new Set<string>();
  const pathCells = new Set<string>();

  for (let i = 0; i <= stepIdx && i >= 0 && i < steps.length; i++) {
    const s = steps[i];
    if (s.type === "PUSH") {
      const key = `${s.row},${s.col}`;
      if (s.direction === "forward")       forwardVisited.add(key);
      else if (s.direction === "backward") backwardVisited.add(key);
      else                                 visited.add(key);
    }
    if (s.type === "FOUND") {
      // path cells override visited
      s.stack.forEach((p) => pathCells.add(`${p.row},${p.col}`));
    }
  }

  const getCellStyle = (value: number, r: number, c: number): React.CSSProperties => {
    const key = `${r},${c}`;

    // Start node
    if (r === start.row && c === start.col) {
      return {
        background: "#22c55e",
        boxShadow: "0 0 10px rgba(34,197,94,0.8), 0 0 20px rgba(34,197,94,0.4)",
        border: "1px solid rgba(34,197,94,0.6)",
      };
    }
    // End node
    if (r === end.row && c === end.col) {
      return {
        background: "#ef4444",
        boxShadow: "0 0 10px rgba(239,68,68,0.8), 0 0 20px rgba(239,68,68,0.4)",
        border: "1px solid rgba(239,68,68,0.6)",
      };
    }
    // Path (found)
    if (pathCells.has(key)) {
      return {
        background: "#facc15",
        boxShadow: "0 0 8px rgba(250,204,21,0.8), 0 0 16px rgba(250,204,21,0.4)",
        border: "1px solid rgba(250,204,21,0.5)",
      };
    }
    // Bidirectional overlap = bright cyan, forward = blue, backward = orange, plain = cyan
    if (forwardVisited.has(key) && backwardVisited.has(key)) {
      return {
        background: "rgba(34,211,238,0.85)",
        boxShadow: "0 0 10px rgba(34,211,238,0.8)",
        border: "1px solid rgba(34,211,238,0.6)",
      };
    }
    if (forwardVisited.has(key)) {
      return {
        background: "rgba(56,189,248,0.55)",
        boxShadow: "0 0 6px rgba(56,189,248,0.5)",
        border: "1px solid rgba(56,189,248,0.3)",
      };
    }
    if (backwardVisited.has(key)) {
      return {
        background: "rgba(251,146,60,0.55)",
        boxShadow: "0 0 6px rgba(251,146,60,0.5)",
        border: "1px solid rgba(251,146,60,0.3)",
      };
    }
    if (visited.has(key)) {
      return {
        background: "rgba(34,211,238,0.5)",
        boxShadow: "0 0 6px rgba(34,211,238,0.5)",
        border: "1px solid rgba(34,211,238,0.3)",
      };
    }
    // Wall
    if (value === 1) {
      return {
        background: "#04080f",
        border: "1px solid rgba(56,189,248,0.1)",
        boxShadow: "inset 0 0 4px rgba(0,0,0,0.8)",
      };
    }
    // Empty cell
    return {
      background: "rgba(8,15,24,0.4)",
      border: "1px solid rgba(34,211,238,0.2)",
    };
  };

  return (
    // 20×20 grid — exact same cell size (28px) and column count (20) preserved
    <div
      className="select-none"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(20, 28px)",
        gap: "1px",
      }}
      onMouseDown={() => setMouseDown(true)}>
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: 28,
              height: 28,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.75 : 1,
              borderRadius: "2px",
              transition: "background 0.15s, box-shadow 0.15s",
              ...getCellStyle(cell, r, c),
            }}
            onMouseEnter={() => mouseDown && handleCell(r, c)}
            onMouseDown={() => handleCell(r, c)}
          />
        ))
      )}
    </div>
  );
};
