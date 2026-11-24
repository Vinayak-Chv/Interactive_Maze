// src/components/Controls.tsx
import { Tool, Algorithm } from "../types";

type Props = {
  playing: boolean;
  paused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onClear: () => void;
  onRandom: () => void;
  speed: number;
  setSpeed: (idx: number) => void;
  tool: Tool;
  setTool: (t: Tool) => void;
  algorithm: Algorithm;
  setAlgorithm: (a: Algorithm) => void;
  disabled: boolean;
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-1.5 mb-2">
    <span style={{ color: "#38bdf8", fontSize: "10px" }}>◆</span>
    <span className="font-heading font-bold text-xs tracking-widest uppercase"
          style={{ color: "#38bdf8", textShadow: "0 0 6px rgba(56,189,248,0.4)" }}>
      {children}
    </span>
  </div>
);

const ALGORITHMS: { key: Algorithm; label: string }[] = [
  { key: "ASTAR",           label: "A* Search"    },
  { key: "DIJKSTRA",        label: "Dijkstra's"   },
  { key: "BFS",             label: "BFS"           },
  { key: "DFS",             label: "DFS"           },
  { key: "BIDIRECTIONAL_BFS", label: "Bi-BFS"     },
];

export const Controls = ({
  playing,
  paused,
  onStart,
  onPause,
  onResume,
  onClear,
  onRandom,
  speed,
  setSpeed,
  tool,
  setTool,
  algorithm,
  setAlgorithm,
  disabled,
}: Props) => {
  return (
    <div className="glass-panel p-4 h-full flex flex-col gap-5" style={{ height: "100%" }}>

      {/* Panel header */}
      <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid rgba(56,189,248,0.2)" }}>
        <span style={{ color: "#38bdf8" }}>⬡</span>
        <span className="font-heading font-bold tracking-widest text-sm uppercase"
              style={{ color: "#38bdf8", textShadow: "0 0 8px rgba(56,189,248,0.5)" }}>
          MAZE CONTROLS
        </span>
      </div>

      {/* ── Action buttons ────────────────────────── */}
      <div className="flex flex-col gap-2">
        {/* Start / Pause / Resume */}
        {!playing && (
          <button
            onClick={onStart}
            disabled={disabled}
            className="w-full py-2 font-heading font-bold text-sm tracking-widest uppercase rounded transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, rgba(21,128,61,0.4) 0%, rgba(34,197,94,0.15) 100%)",
              border: "1px solid #22c55e",
              color: "#22c55e",
              boxShadow: "0 0 12px rgba(34,197,94,0.3), inset 0 0 8px rgba(34,197,94,0.05)",
            }}>
            ▶ Start Visualization
          </button>
        )}
        {playing && !paused && (
          <button
            onClick={onPause}
            className="w-full py-2 font-heading font-bold text-sm tracking-widest uppercase rounded transition-all duration-200"
            style={{
              background: "rgba(56,189,248,0.1)",
              border: "1px solid rgba(56,189,248,0.4)",
              color: "#38bdf8",
            }}>
            ⏸ Pause
          </button>
        )}
        {paused && (
          <button
            onClick={onResume}
            className="w-full py-2 font-heading font-bold text-sm tracking-widest uppercase rounded transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, rgba(21,128,61,0.4) 0%, rgba(34,197,94,0.15) 100%)",
              border: "1px solid #22c55e",
              color: "#22c55e",
            }}>
            ▶ Resume
          </button>
        )}

        {/* Clear + Random — side by side */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onClear}
            className="py-1.5 font-heading font-semibold text-xs tracking-wider uppercase rounded transition-all duration-200"
            style={{
              background: "rgba(8,15,24,0.8)",
              border: "1px solid rgba(100,116,139,0.4)",
              color: "#94a3b8",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(100,116,139,0.8)"; e.currentTarget.style.color = "#e2e8f0"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(100,116,139,0.4)"; e.currentTarget.style.color = "#94a3b8"; }}>
            Clear
          </button>
          <button
            onClick={onRandom}
            disabled={playing}
            className="py-1.5 font-heading font-semibold text-xs tracking-wider uppercase rounded transition-all duration-200"
            style={{
              background: "rgba(8,15,24,0.8)",
              border: "1px solid rgba(56,189,248,0.3)",
              color: "#38bdf8",
            }}
            onMouseEnter={e => { if (!playing) { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.boxShadow = "0 0 8px rgba(56,189,248,0.3)"; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(56,189,248,0.3)"; e.currentTarget.style.boxShadow = "none"; }}>
            Random
          </button>
        </div>
      </div>

      {/* ── Speed control ─────────────────────────── */}
      <div>
        <SectionLabel>Speed</SectionLabel>
        <input
          type="range"
          min={0} max={2} step={1}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="slider-cyan w-full"
        />
        <div className="flex justify-between mt-1" style={{ fontSize: "10px", color: "#64748b" }}>
          <span>Slow</span><span>Normal</span><span>Fast</span>
        </div>
      </div>

      {/* ── Algorithm selector ────────────────────── */}
      <div>
        <SectionLabel>Select Algorithm</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {ALGORITHMS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => !disabled && setAlgorithm(key)}
              className={`algo-btn ${algorithm === key ? "active" : ""}`}
              disabled={disabled}>
              {algorithm === key ? `${label} ✓` : label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tool selector ─────────────────────────── */}
      <div>
        <SectionLabel>Tool</SectionLabel>
        <div className="relative w-full">
          <select
            value={tool}
            onChange={(e) => setTool(e.target.value as Tool)}
            disabled={disabled}
            className="select-dark w-full font-mono text-sm">
            <option value="wall">Wall</option>
            <option value="erase">Erase</option>
            <option value="start">Start Node</option>
            <option value="end">End Node</option>
          </select>
        </div>
      </div>
    </div>
  );
};
