// src/App.tsx
import { useState, useEffect, useRef } from "react";
import { Grid, Position, Step, Tool, Algorithm } from "./types";
import { createEmptyGrid, generateRandomMaze } from "./logic/maze";
import { dfs } from "./logic/dfs";
import { bfs } from "./logic/bfs";
import { astar } from "./logic/astar";
import { dijkstra } from "./logic/dijkstra";
import { bidirectionalBfs } from "./logic/bidirectionalBfs";
import { GridComponent } from "./components/Grid";
import { Controls } from "./components/Controls";
import { MetricsPanel } from "./components/MetricsPanel";

const App = () => {
  // Core data — 20×20 grid preserved exactly
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [start, setStart] = useState<Position>({ row: 0, col: 0 });
  const [end, setEnd] = useState<Position>({ row: 19, col: 19 });

  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState<number>(-1);

  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  // Speed: 0 = Slow, 1 = Normal, 2 = Fast
  const [speedIdx, setSpeedIdx] = useState<number>(1);
  const speedValues = [500, 100, 20];
  const intervalSpeed = speedValues[speedIdx];

  const [tool, setTool] = useState<Tool>("wall");
  const [algorithm, setAlgorithm] = useState<Algorithm>("ASTAR");


  const intervalRef = useRef<number | null>(null);

  // Playback control
  const startPlayback = () => {
    let result: Step[];
    if (algorithm === "BFS") result = bfs(grid, start, end);
    else if (algorithm === "ASTAR") result = astar(grid, start, end);
    else if (algorithm === "DIJKSTRA") result = dijkstra(grid, start, end);
    else if (algorithm === "BIDIRECTIONAL_BFS") result = bidirectionalBfs(grid, start, end);
    else result = dfs(grid, start, end);

    setSteps(result);
    setStepIdx(0);
    setPlaying(true);
    setPaused(false);
  };

  const pausePlayback = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPaused(true);
  };

  const resumePlayback = () => {
    setPaused(false);
  };

  const clearAll = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setGrid(createEmptyGrid());
    setSteps([]);
    setStepIdx(-1);
    setPlaying(false);
    setPaused(false);
  };

  const randomMaze = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const newGrid = generateRandomMaze(createEmptyGrid(), start, end);
    setGrid(newGrid);
    setSteps([]);
    setStepIdx(-1);
    setPlaying(false);
    setPaused(false);
  };

  // Animation interval
  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (playing && !paused && stepIdx < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setStepIdx((prev) => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setPlaying(false);
          }
          return next;
        });
      }, intervalSpeed);
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playing, paused, intervalSpeed, steps, stepIdx]);

  // Grid editing helper
  const updateCell = (r: number, c: number, val: number) => {
    setGrid((g) => {
      const copy = g.map((row) => [...row]);
      copy[r][c] = val as 0 | 1;
      return copy;
    });
  };

  // Compute live metrics
  const currentStep = steps[stepIdx] ?? null;
  const queueSize = currentStep?.stack.length ?? 0;
  const nodesExplored = steps.slice(0, stepIdx + 1).filter(s => s.type === "PUSH").length;
  const stepsTaken = stepIdx >= 0 ? stepIdx + 1 : 0;

  let status: "ready" | "running" | "done" | "error" = "ready";
  if (playing && !paused) status = "running";
  else if (currentStep?.type === "FOUND") status = "done";
  else if (currentStep?.type === "NO_PATH") status = "error";
  else if (paused) status = "running";

  return (
    <div className="min-h-screen bg-blueprint flex flex-col overflow-hidden"
      style={{ background: "#080f18", backgroundImage: "linear-gradient(rgba(56,189,248,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px" }}>

      {/* ── Top Header ─────────────────────────────────── */}
      <header className="glass-panel rounded-none border-x-0 border-t-0 px-6 py-3 flex justify-between items-center"
        style={{ borderBottom: "1px solid rgba(56,189,248,0.2)" }}>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span style={{ color: "#38bdf8", fontSize: "1.1rem" }}>⬡</span>
          <span className="font-display font-bold text-white tracking-widest text-lg select-none">INTERACTIVE</span>
          <span className="font-display font-bold tracking-widest text-lg select-none" style={{ color: "#38bdf8", textShadow: "0 0 12px rgba(56,189,248,0.7)" }}>MAZE SOLVER</span>
        </div>


      </header>

      {/* ── Main 3-column layout ───────────────────────── */}
      <main className="flex flex-1 overflow-hidden gap-3 p-3">

        {/* Left sidebar */}
        <aside className="w-56 flex-shrink-0">
          <Controls
            playing={playing}
            paused={paused}
            onStart={startPlayback}
            onPause={pausePlayback}
            onResume={resumePlayback}
            onClear={clearAll}
            onRandom={randomMaze}
            speed={speedIdx}
            setSpeed={setSpeedIdx}
            tool={tool}
            setTool={setTool}
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            disabled={playing && !paused}
          />
        </aside>

        {/* Center grid */}
        <section className="flex-1 flex justify-center items-center">
          <div className="glass-panel p-3" style={{ boxShadow: "0 0 24px rgba(56,189,248,0.15)" }}>
            <GridComponent
              grid={grid}
              start={start}
              end={end}
              tool={tool}
              onUpdate={updateCell}
              onSetStart={setStart}
              onSetEnd={setEnd}
              disabled={playing && !paused}
              steps={steps}
              stepIdx={stepIdx}
            />
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="w-60 flex-shrink-0">
          <MetricsPanel
            status={status}
            stepsTaken={stepsTaken}
            queueSize={queueSize}
            nodesExplored={nodesExplored}
            algorithm={algorithm}
            steps={steps}
            stepIdx={stepIdx}
          />
        </aside>
      </main>
    </div>
  );
};

export default App;
