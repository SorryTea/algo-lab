import { useEffect, useRef, useState } from "react";
import { executeAlgorithm } from "../lib/api";

const C_DEFAULT = "#334155";
const C_VISITED = "#34d399";
const C_FRONTIER = "#8b5cf6";
const C_CURRENT = "#fbbf24";

function parseEdges(text) {
  return text
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.split(/[-\s]+/).map((x) => parseInt(x, 10)))
    .filter((p) => p.length === 2 && p.every(Number.isInteger));
}

function randomGraph(n) {
  const edges = [];
  for (let i = 1; i < n; i++) {
    edges.push([Math.floor(Math.random() * i), i]);
  }
  const extra = Math.max(1, Math.floor(n / 2));
  for (let k = 0; k < extra; k++) {
    const a = Math.floor(Math.random() * n);
    const b = Math.floor(Math.random() * n);
    if (a !== b && !edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) {
      edges.push([a, b]);
    }
  }
  return edges;
}

export default function GraphVisualizer({ algorithmName }) {
  const [verticesCount, setVerticesCount] = useState(6);
  const [edgesText, setEdgesText] = useState("0-1, 0-2, 1-3, 2-3, 3-4, 4-5");
  const [startVertex, setStartVertex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [delay, setDelay] = useState(600);
  const [status, setStatus] = useState("idle");
  const [meta, setMeta] = useState(null);
  const timer = useRef(null);

  function applyRandom() {
    const n = Math.max(2, Math.min(12, Number(verticesCount) || 6));
    const edges = randomGraph(n);
    setVerticesCount(n);
    setEdgesText(edges.map(([a, b]) => `${a}-${b}`).join(", "));
    setStartVertex(0);
  }

  async function run() {
    const n = Math.max(1, Math.min(12, Number(verticesCount) || 0));
    const vertices = Array.from({ length: n }, (_, i) => i);
    const edges = parseEdges(edgesText).filter(
      ([a, b]) => a >= 0 && b >= 0 && a < n && b < n
    );
    const start = Number(startVertex) || 0;
    if (vertices.length === 0 || start >= n) {
      setStatus("error");
      setSteps([]);
      return;
    }
    setStatus("loading");
    setPlaying(false);
    try {
      const res = await executeAlgorithm(algorithmName, [], {
        vertices,
        edges,
        startVertex: start,
      });
      setSteps(res.steps ?? []);
      setMeta({ totalSteps: res.totalSteps, executionTimeMs: res.executionTimeMs });
      setCurrent(0);
      setStatus("ready");
      setPlaying(true);
    } catch {
      setStatus("error");
      setSteps([]);
    }
  }

  useEffect(() => {
    if (!playing) return;
    if (current >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setCurrent((c) => c + 1), delay);
    return () => clearTimeout(timer.current);
  }, [playing, current, steps.length, delay]);

  const previewN = Math.max(1, Math.min(12, Number(verticesCount) || 0));
  const previewVertices = Array.from({ length: previewN }, (_, i) => i);
  const step =
    steps.length > 0
      ? steps[current]
      : {
          vertices: previewVertices,
          edges: parseEdges(edgesText).filter(([a, b]) => a < previewN && b < previewN),
          visited: [],
          frontier: [],
          current: null,
          description: "",
        };

  const verts = step.vertices ?? [];
  const edges = step.edges ?? [];
  const visited = new Set(step.visited ?? []);
  const frontier = new Set(step.frontier ?? []);

  const W = 400, H = 320, cx = W / 2, cy = H / 2, R = 120, r = 18;
  const pos = (i) => {
    const a = (2 * Math.PI * i) / Math.max(1, verts.length) - Math.PI / 2;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  };
  const colorFor = (v) => {
    if (step.current === v) return C_CURRENT;
    if (frontier.has(v)) return C_FRONTIER;
    if (visited.has(v)) return C_VISITED;
    return C_DEFAULT;
  };
  const atEnd = steps.length > 0 && current >= steps.length - 1;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-obsidian-muted">
          Wierzchołki:
          <input
            type="number"
            min={1}
            max={12}
            value={verticesCount}
            onChange={(e) => setVerticesCount(e.target.value)}
            className="ml-2 w-20 px-2 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
          />
        </label>
        <label className="text-sm text-obsidian-muted">
          Start:
          <input
            type="number"
            min={0}
            value={startVertex}
            onChange={(e) => setStartVertex(e.target.value)}
            className="ml-2 w-20 px-2 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
          />
        </label>
        <button
          onClick={applyRandom}
          className="px-3 py-2 rounded-lg border border-obsidian-border text-sm hover:border-violet-500"
        >
          Losuj
        </button>
        <button
          onClick={run}
          disabled={status === "loading"}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 disabled:opacity-50"
        >
          {status === "loading" ? "Liczę…" : "Uruchom"}
        </button>
      </div>

      <input
        value={edgesText}
        onChange={(e) => setEdgesText(e.target.value)}
        placeholder="krawędzie, np. 0-1, 1-2, 2-3"
        className="w-full px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
      />

      {status === "error" && (
        <p className="text-red-400 text-sm">
          Nie udało się uruchomić. Sprawdź liczbę wierzchołków, krawędzie i wierzchołek startowy.
        </p>
      )}

      <div className="rounded-xl border border-obsidian-border bg-obsidian-elevated p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-64">
          {edges.map(([a, b], i) => {
            const pa = pos(verts.indexOf(a));
            const pb = pos(verts.indexOf(b));
            return (
              <line
                key={i}
                x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke="#475569" strokeWidth={2}
              />
            );
          })}
          {verts.map((v, i) => {
            const p = pos(i);
            return (
              <g key={v}>
                <circle cx={p.x} cy={p.y} r={r} fill={colorFor(v)} stroke="#0f172a" strokeWidth={2} />
                <text
                  x={p.x} y={p.y}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize="14" fill="#fff" fontWeight="600"
                >
                  {v}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex flex-wrap gap-4 mt-2 text-xs text-obsidian-muted">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: C_CURRENT }} /> aktualny</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: C_FRONTIER }} /> w kolejce</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: C_VISITED }} /> odwiedzony</span>
        </div>
      </div>

      {steps.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => { setPlaying(false); setCurrent((c) => Math.max(0, c - 1)); }}
              className="px-3 py-2 rounded-lg border border-obsidian-border text-sm hover:border-violet-500"
            >Krok</button>

            {atEnd ? (
              <button
                onClick={() => { setCurrent(0); setPlaying(true); }}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500"
              >↻ Od nowa</button>
            ) : (
              <button
                onClick={() => setPlaying((p) => !p)}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500"
              >{playing ? "Pauza" : "Odtwórz"}</button>
            )}

            <button
              onClick={() => { setPlaying(false); setCurrent((c) => Math.min(steps.length - 1, c + 1)); }}
              className="px-3 py-2 rounded-lg border border-obsidian-border text-sm hover:border-violet-500"
            >Krok</button>

            <select
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
            >
              <option value={900}>Wolno</option>
              <option value={600}>Średnio</option>
              <option value={250}>Szybko</option>
            </select>
          </div>

          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={current}
            onChange={(e) => { setPlaying(false); setCurrent(Number(e.target.value)); }}
            className="w-full accent-violet-500"
          />

          <p className="text-sm text-obsidian-muted">
            Krok {current + 1} / {steps.length} · {step.description}
          </p>
          {meta && (
            <p className="text-xs text-obsidian-muted">
              Backend: {meta.totalSteps} kroków, {meta.executionTimeMs} ms
            </p>
          )}
        </>
      )}
    </div>
  );
}