/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Dark theme palette ───────────────────────────────
        navy:     "#080f18",
        "navy-2": "#0d1826",
        "navy-3": "#0a1929",
        panel:    "rgba(13,25,42,0.85)",
        ink:      "#e2e8f0",
        cyan:     "#38bdf8",
        "cyan-dim":"rgba(56,189,248,0.35)",
        "cyan-glow":"rgba(56,189,248,0.6)",
        wall:     "#04080f",
        cell:     "rgba(8,15,24,0.6)",
        gridline: "rgba(34,211,238,0.3)",
        start:    "#22c55e",
        "start-glow":"rgba(34,197,94,0.5)",
        goal:     "#ef4444",
        "goal-glow":"rgba(239,68,68,0.5)",
        visited:  "#22d3ee",
        path:     "#facc15",
        "path-glow":"rgba(250,204,21,0.6)",
        found:    "#facc15",
        push:     "#22c55e",
        pop:      "#f97316",
      },
      fontFamily: {
        display: ["'Orbitron'", "sans-serif"],
        heading: ["'Rajdhani'", "sans-serif"],
        body:    ["'Inter'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        "cyan-glow":  "0 0 12px rgba(56,189,248,0.5), 0 0 24px rgba(56,189,248,0.2)",
        "green-glow": "0 0 10px rgba(34,197,94,0.6),  0 0 20px rgba(34,197,94,0.3)",
        "red-glow":   "0 0 10px rgba(239,68,68,0.6),  0 0 20px rgba(239,68,68,0.3)",
        "gold-glow":  "0 0 10px rgba(250,204,21,0.6), 0 0 20px rgba(250,204,21,0.3)",
      },
      backgroundImage: {
        "blueprint": "linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "blueprint": "40px 40px",
      },
      animation: {
        "pulse-slow":  "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
        "flicker":     "flicker 1.5s ease-in-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
