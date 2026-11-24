
import { useState, useEffect, useRef } from "react";
import { Grid, Position, Step, Tool, Algorithm } from "./types";
import { createEmptyGrid, generateRandomMaze } from "./logic/maze";
import { dfs } from "./logic/dfs";
import { bidirectionalBfs } from "./logic/bidirectionalBfs";
import { GridComponent } from "./components/Grid";
import { Controls } from "./components/Controls";
import { StepTracker } from "./components/StepTracker";

const App = () => {
  // Core data
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [start, setStart] = useState<Position>({ row: 0, col: 0 });
  const [end, setEnd] = useState<Position>({ row: 19, col: 19 });

  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState<number>(-1);

  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  // Speed: 0 = Slow, 1 = Normal, 2 = Fast
  const [speedIdx, setSpeedIdx] = useState<number>(1);
  const speedValues = [500, 200, 50];
  const intervalSpeed = speedValues[speedIdx];

  const [tool, setTool] = useState<Tool>("wall");
  const [algorithm, setAlgorithm] = useState<Algorithm>("DFS");

  const intervalRef = useRef<number | null>(null);

  // Playback control
  const startPlayback = () => {
    const result =
      algorithm === "BIDIRECTIONAL_BFS"
        ? bidirectionalBfs(grid, start, end)
        : dfs(grid, start, end);

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

  return (
    <div className="min-h-screen bg-paper font-sans text-ink flex flex-col">
      {/* Header */}
      <header className="p-4 bg-panel flex justify-between items-center shadow">
        <h1 className="font-serif text-2xl">Interactive Maze Solver</h1>
      </header>

      {/* Main layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left controls */}
        <section className="w-60">
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
        </section>

        {/* Center grid */}
        <section className="flex-1 flex justify-center items-center p-4">
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
        </section>

        {/* Right step tracker */}
        <section className="w-72 flex flex-col min-h-0 overflow-hidden">
          <StepTracker steps={steps} currentIndex={stepIdx} />
        </section>
      </main>
    </div>
  );
};

export default App;
