// src/components/MetricsPanel.tsx
import { useState } from "react";
import { Step, Algorithm, Position } from "../types";

type Status = "ready" | "running" | "done" | "error";

type Props = {
  status: Status;
  stepsTaken: number;
  queueSize: number;
  nodesExplored: number;
  algorithm: Algorithm;
  steps: Step[];
  stepIdx: number;
};

const statusLabel: Record<Status, string> = {
  ready:   "Ready",
  running: "Running",
  done:    "Completed",
  error:   "No Path Found",
};

const queueLabel: Record<Algorithm, string> = {
  ASTAR:            "Priority Queue",
  DIJKSTRA:         "Priority Queue",
  BFS:              "Queue",
  DFS:              "Stack",
  BIDIRECTIONAL_BFS:"Dual Queue",
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

const MetricRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-baseline py-1.5"
       style={{ borderBottom: "1px solid rgba(56,189,248,0.08)" }}>
    <span className="font-mono text-xs" style={{ color: "#64748b" }}>{label}</span>
    <span className="font-mono text-sm font-semibold" style={{ color: "#38bdf8", textShadow: "0 0 6px rgba(56,189,248,0.4)" }}>
      {value}
    </span>
  </div>
);

export const MetricsPanel = ({
  status,
  stepsTaken,
  queueSize,
  nodesExplored,
  algorithm,
  steps,
  stepIdx,
}: Props) => {
  const [showDetails, setShowDetails] = useState(false);

  const currentStep = steps[stepIdx] ?? null;
  const stackItems: Position[] = currentStep?.stack ?? [];

  // Event log: last 50 push/pop events up to current index
  const logLines = steps
    .slice(0, stepIdx + 1)
    .filter(s => s.type === "PUSH" || s.type === "POP")
    .slice(-50);

  return (
    <div className="glass-panel p-4 h-full flex flex-col gap-4" style={{ height: "100%" }}>

      {/* Panel header */}
      <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid rgba(56,189,248,0.2)" }}>
        <span style={{ color: "#38bdf8" }}>⬡</span>
        <span className="font-heading font-bold tracking-widest text-sm uppercase"
              style={{ color: "#38bdf8", textShadow: "0 0 8px rgba(56,189,248,0.5)" }}>
          Execution Metrics
        </span>
      </div>

      {/* Status row */}
      <div>
        <SectionLabel>System Status</SectionLabel>
        <div className="flex items-center gap-2 py-1">
          <span className={`status-dot ${status}`} />
          <span className="font-heading font-semibold text-sm"
                style={{ color: status === "done" ? "#facc15" : status === "error" ? "#ef4444" : status === "running" ? "#38bdf8" : "#22c55e" }}>
            {statusLabel[status]}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex flex-col">
        <SectionLabel>Live Stats</SectionLabel>
        <MetricRow label="Steps taken" value={stepsTaken} />
        <MetricRow
          label={queueLabel[algorithm] + " size"}
          value={queueSize}
        />
        <MetricRow label="Nodes explored" value={nodesExplored} />
        <MetricRow label="Algorithm" value={algorithm === "ASTAR" ? "A*" : algorithm} />
      </div>

      {/* Spacer */}
      <div className="flex-1 overflow-hidden">
        {showDetails && (
          <div className="flex flex-col gap-2 h-full overflow-hidden">
            <button
              className="self-end text-xs underline font-mono"
              style={{ color: "#64748b" }}
              onClick={() => setShowDetails(false)}>
              ✕ Close
            </button>

            {/* Stack / Queue display */}
            <div className="flex-1 overflow-y-auto scrollbar-dark rounded"
                 style={{ background: "rgba(8,15,24,0.6)", border: "1px solid rgba(56,189,248,0.15)", padding: "0.5rem" }}>
              <div className="font-heading font-semibold text-xs tracking-wider uppercase mb-1"
                   style={{ color: "#38bdf8" }}>
                {queueLabel[algorithm]} (top ↓)
              </div>
              {stackItems.slice().reverse().map((p: Position, i) => (
                <div key={i} className="font-mono text-xs py-0.5" style={{ color: "#94a3b8" }}>
                  [{p.row}, {p.col}]
                </div>
              ))}
              {stackItems.length === 0 && (
                <div className="font-mono text-xs" style={{ color: "#334155" }}>Empty</div>
              )}
            </div>

            {/* Event log */}
            <div className="flex-1 overflow-y-auto scrollbar-dark rounded"
                 style={{ background: "rgba(8,15,24,0.6)", border: "1px solid rgba(56,189,248,0.15)", padding: "0.5rem" }}>
              <div className="font-heading font-semibold text-xs tracking-wider uppercase mb-1"
                   style={{ color: "#38bdf8" }}>
                Event Log
              </div>
              {logLines.map((s, i) => (
                <div key={i} className="font-mono text-xs py-0.5"
                     style={{ color: s.type === "PUSH" ? "#22c55e" : "#f97316" }}>
                  {s.type} [{s.row}, {s.col}]
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Show Details button — anchored bottom */}
      {!showDetails && (
        <button
          onClick={() => setShowDetails(true)}
          className="w-full py-2 font-heading font-bold text-xs tracking-widest uppercase btn-chamfer transition-all duration-200"
          style={{
            background: "rgba(8,15,24,0.8)",
            border: "1px solid rgba(56,189,248,0.4)",
            color: "#38bdf8",
            boxShadow: "0 0 10px rgba(56,189,248,0.2)",
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 16px rgba(56,189,248,0.4)"; e.currentTarget.style.borderColor = "#38bdf8"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 10px rgba(56,189,248,0.2)"; e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)"; }}>
          ◈ Show Details
        </button>
      )}
    </div>
  );
};
