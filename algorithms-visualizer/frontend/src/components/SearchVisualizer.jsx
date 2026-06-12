import { useEffect, useRef, useState } from "react";
import { executeAlgorithm } from "../lib/api";

const COLOR_DEFAULT = "#8b5cf6";
const COLOR_COMPARE = "#fbbf24";
const COLOR_FOUND = "#34d399";

function parseInput(text) {
  return text
    .split(/[\s,]+/)
    .map((t) => parseInt(t, 10))
    .filter((n) => Number.isInteger(n));
}

function randomSorted(n = 9, max = 40) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * max) + 1).sort(
    (a, b) => a - b
  );
}

export default function SearchVisualizer({ algorithmName }) {
  const [inputText, setInputText] = useState("1, 3, 5, 7, 9, 11, 13, 15");
  const [targetText, setTargetText] = useState("7");
  const [steps, setSteps] = useState([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [delay, setDelay] = useState(400);
  const [status, setStatus] = useState("idle");
  const [meta, setMeta] = useState(null);
  const timer = useRef(null);

  async function run() {
    const data = parseInput(inputText).slice(0, 30).sort((a, b) => a - b);
    const target = parseInt(targetText, 10);
    if (data.length === 0 || !Number.isInteger(target)) {
      setStatus("error");
      setSteps([]);
      return;
    }
    setInputText(data.join(", ")); 
    setStatus("loading");
    setPlaying(false);
    try {
      const res = await executeAlgorithm(algorithmName, data, { target });
      setSteps(res.steps ?? []);
      setMeta({ totalSteps: res.totalSteps, timeUs: res.executionTimeMicroseconds ?? null });
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

  const preview = parseInput(inputText).slice(0, 30).sort((a, b) => a - b);
  const step =
    steps.length > 0
      ? steps[current]
      : { array: preview, comparing: [], sortedIndices: [], description: "" };
  const maxVal = Math.max(...(step.array.length ? step.array : [1]), 1);
  const atEnd = steps.length > 0 && current >= steps.length - 1;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="np. 1, 3, 5, 7"
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
        />
        <input
          value={targetText}
          onChange={(e) => setTargetText(e.target.value)}
          placeholder="szukana wartość"
          className="w-32 px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
        />
        <button
          onClick={() => setInputText(randomSorted().join(", "))}
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

      <p className="text-xs text-obsidian-muted">
        Tablica zostanie automatycznie posortowana - wyszukiwanie binarne wymaga
        uporządkowanych danych.
      </p>

      {status === "error" && (
        <p className="text-red-400 text-sm">
          Nie udało się uruchomić. Sprawdź dane i szukaną wartość (liczby całkowite).
        </p>
      )}

      <div className="h-64 rounded-xl border border-obsidian-border bg-obsidian-elevated p-4 flex items-end gap-1">
        {step.array.map((value, i) => {
          let color = COLOR_DEFAULT;
          if (step.sortedIndices?.includes(i)) color = COLOR_FOUND;
          if (step.comparing?.includes(i)) color = COLOR_COMPARE;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
              <div
                className="w-full rounded-t transition-all duration-150"
                style={{ height: `${(value / maxVal) * 100}%`, backgroundColor: color }}
                title={String(value)}
              />
              <span className="text-[10px] text-obsidian-muted">{value}</span>
            </div>
          );
        })}
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
              <option value={700}>Wolno</option>
              <option value={400}>Średnio</option>
              <option value={150}>Szybko</option>
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
              Backend: {meta.totalSteps} kroków{meta.timeUs != null ? ` · ${meta.timeUs} µs` : ""}
            </p>
          )}
        </>
      )}
    </div>
  );
}