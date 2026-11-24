# Interactive Maze Solver AI

A futuristic, interactive web application built with **React**, **TypeScript**, and **Tailwind CSS** that visualizes pathfinding algorithms on an interactive 20 × 20 grid. Watch algorithms explore the grid in real-time, inspect internal data structures (queues, stacks, and priority queues), and analyze performance metrics as paths are discovered.

---

## ✨ Features

- **5 Pathfinding Algorithms**:
  - **A\* Search**: Informed heuristic search minimizing $f(n) = g(n) + h(n)$ with Manhattan distance.
  - **Dijkstra’s Algorithm**: Weighted/uniform graph search guaranteeing the shortest path.
  - **Breadth-First Search (BFS)**: Unweighted level-order exploration finding the shortest path.
  - **Depth-First Search (DFS)**: Stack-based graph traversal exploring deeply before backtracking.
  - **Bidirectional BFS**: Dual-frontier simultaneous search expanding from both Start and End nodes until meeting in the middle.

- **Futuristic Cyberpunk / Blueprint Dark Theme**:
  - Deep navy slate background with subtle blueprint grid lines.
  - Glassmorphic panels with cyan glow highlights and modern geometric typography (`Orbitron`, `Rajdhani`, `Inter`, `JetBrains Mono`).
  - Neon visual indicators:
    - **Start Node**: Neon green with outer glow.
    - **End Node**: Neon red with outer glow.
    - **Wall Node**: Obsidian dark slate.
    - **Exploration Frontier**: Cyan pulses for standard search; directional blue (forward) & orange (backward) for Bidirectional BFS.
    - **Shortest Path**: Radiant gold/yellow trail.

- **Interactive Maze Canvas (20 × 20)**:
  - Click or drag to draw or erase walls.
  - Reposition Start and End targets with dedicated tool selectors.
  - **Random Maze Generator**: Generates solvable mazes (~28% wall density) with path guarantee.

- **Live Execution Metrics**:
  - Real-time status indicator (`Ready`, `Running`, `Completed`, `No Path Found`).
  - Step counter and nodes explored tally.
  - Context-aware data structure tracking (Priority Queue for A\*/Dijkstra, Queue for BFS, Stack for DFS, Dual Queue for Bidirectional BFS).
  - Expandable **Details View** showing top-down data structure contents and chronological event logs.

- **Playback & Speed Controls**:
  - Start, pause, resume, and board reset.
  - Glowing slider to toggle between **Slow** (500 ms), **Normal** (100 ms), and **Fast** (20 ms).

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) (Hooks: `useState`, `useEffect`, `useRef`)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict typing)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom animations and glassmorphism

---

## 📦 Project Structure

```
Interactive_Maze/
├── src/
│   ├── components/
│   │   ├── Controls.tsx        # Left sidebar: playback buttons, speed slider, algo selector, tools
│   │   ├── Grid.tsx            # Center canvas: 20x20 grid with mouse drawing & state styling
│   │   └── MetricsPanel.tsx    # Right sidebar: live stats, status, data structure & event logs
│   ├── logic/
│   │   ├── astar.ts            # A* Search algorithm implementation
│   │   ├── dijkstra.ts         # Dijkstra's algorithm implementation
│   │   ├── bfs.ts              # Breadth-First Search implementation
│   │   ├── dfs.ts              # Depth-First Search implementation
│   │   ├── bidirectionalBfs.ts # Bidirectional BFS implementation
│   │   └── maze.ts             # Grid generation & solvable random maze builder
│   ├── App.tsx                 # Core layout, global state, playback loop
│   ├── types.ts                # TypeScript interfaces (Step, Position, Grid, Algorithm, Tool)
│   ├── index.css               # Tailwind directives, animations & custom cyber-theme styles
│   └── main.tsx                # React root entry
├── index.html                  # HTML entry with Google Web Fonts
├── tailwind.config.js          # Extended color palette, fonts, shadows, and blueprint patterns
├── tsconfig.json               # TypeScript compiler config
└── package.json                # Project dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd Interactive_Maze
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/` (or the port indicated in the terminal).

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🎮 How to Use

| Control | Description |
|---|---|
| **▶ Start Visualization** | Starts animating the pathfinding exploration for the chosen algorithm. |
| **⏸ Pause / ▶ Resume** | Temporarily halts or resumes visualization playback. |
| **Clear** | Resets the grid cells, explored history, and metrics. |
| **Random** | Generates a new random maze guaranteed to have a valid path. |
| **Speed Slider** | Controls interval speed (`Slow`, `Normal`, `Fast`). |
| **Select Algorithm** | Choose between **A\* Search**, **Dijkstra's**, **BFS**, **DFS**, and **Bi-BFS**. |
| **Tool** | Select between `Wall` (place walls), `Erase` (remove walls), `Start Node` (place start), and `End Node` (place target). |
| **◈ Show Details** | Expands the execution metrics panel to inspect current queue/stack entries and the event log. |

---

## 🧩 Solvable Maze Guarantee

The `generateRandomMaze` generator:
1. Populates approximately 28% of the grid with walls while protecting start and target coordinates.
2. Runs a BFS verification pass to test connectivity between start and end nodes.
3. Automatically regenerates up to 10 times until a valid path exists, falling back to a cleared grid if no solvable configuration is found.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
