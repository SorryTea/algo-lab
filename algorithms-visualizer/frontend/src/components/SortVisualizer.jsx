import { useEffect, useRef, useState } from "react";
import { executeAlgorithm } from "../lib/api";
import {
  MIN_ELEMENTS,
  MAX_VISUALIZE,
  parseNumbers,
  randomArray,
  formatDuration,
} from "../lib/visualization";

const COLOR_DEFAULT = "#8b5cf6";
const COLOR_COMPARE = "#fbbf24";
const COLOR_SORTED = "#34d399";

const D_MIN = 40;
const D_MAX = 700;

export default function SortVisualizer({ algorithmName }) {
  const [count, setCount] = useState(12);
  const [inputText, setInputText] = useState(() => randomArray(12).join(", "));
  const [steps, setSteps] = useState([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [delay, setDelay] = useState(300);
  const [status, setStatus] = useState("idle");
  const [meta, setMeta] = useState(null);
  const timer = useRef(null);

  function generate(n = count) {
    const size = Math.max(MIN_ELEMENTS, Math.min(MAX_VISUALIZE, n));
    setInputText(randomArray(size).join(", "));
    setSteps([]);
    setMeta(null);
    setStatus("idle");
    setPlaying(false);
    setCurrent(0);
  }

  async function run() {
    const data = parseNumbers(inputText).slice(0, MAX_VISUALIZE);
    if (data.length === 0) {
      setStatus("error");
      setSteps([]);
      return;
    }
    setStatus("loading");
    setPlaying(false);
    try {
      const res = await executeAlgorithm(algorithmName, data);
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

  const preview = parseNumbers(inputText).slice(0, MAX_VISUALIZE);
  const parsedCount = preview.length;
  const step =
    steps.length > 0
      ? steps[current]
      : { array: preview, comparing: [], sortedIndices: [], description: "" };
  const maxVal = Math.max(...(step.array.length ? step.array : [1]), 1);
  const atEnd = steps.length > 0 && current >= steps.length - 1;

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      {/* LEWA KOLUMNA: animacja + odtwarzanie */}
      <div className="space-y-4 min-w-0">
        <div className="h-72 rounded-2xl border border-obsidian-border bg-obsidian-elevated p-4 flex items-end gap-[2px]">
          {step.array.map((value, i) => {
            let color = COLOR_DEFAULT;
            if (step.sortedIndices?.includes(i)) color = COLOR_SORTED;
            if (step.comparing?.includes(i)) color = COLOR_COMPARE;
            return (
              <div
                key={i}
                className="flex-1 rounded-t transition-all duration-150"
                style={{ height: `${(value / maxVal) * 100}%`, backgroundColor: color }}
                title={String(value)}
              />
            );
          })}
        </div>

        {steps.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { setPlaying(false); setCurrent((c) => Math.max(0, c - 1)); }}
                className="px-3 py-2 rounded-lg border border-obsidian-border text-sm hover:border-violet-500"
              >‹ Krok</button>

              {atEnd ? (
                <button
                  onClick={() => { setCurrent(0); setPlaying(true); }}
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500"
                >↻ Od nowa</button>
              ) : (
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500"
                >{playing ? "❚❚ Pauza" : "► Odtwórz"}</button>
              )}

              <button
                onClick={() => { setPlaying(false); setCurrent((c) => Math.min(steps.length - 1, c + 1)); }}
                className="px-3 py-2 rounded-lg border border-obsidian-border text-sm hover:border-violet-500"
              >Krok ›</button>

              <span className="ml-auto text-sm text-obsidian-muted tabular-nums">
                {current + 1} / {steps.length}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={steps.length - 1}
              value={current}
              onChange={(e) => { setPlaying(false); setCurrent(Number(e.target.value)); }}
              className="w-full accent-violet-500"
            />

            <p className="text-sm text-obsidian-text min-h-[1.25rem]">{step.description}</p>
            {meta && (
              <p className="text-xs text-obsidian-muted">
                Backend: {meta.totalSteps} kroków
                {meta.timeUs != null && <> · {formatDuration(meta.timeUs)}</>}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-obsidian-muted">
            Ustaw dane po prawej i naciśnij „Uruchom”, aby zobaczyć animację.
          </p>
        )}
      </div>

      {/* PRAWA KOLUMNA: karta ustawień */}
      <aside className="rounded-2xl border border-obsidian-border bg-obsidian-surface p-5 space-y-5 lg:sticky lg:top-4">
        <h3 className="text-sm font-semibold text-obsidian-text uppercase tracking-wide">
          Ustawienia
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-obsidian-muted">Liczba elementów</span>
            <span className="text-obsidian-text font-medium tabular-nums">{count}</span>
          </div>
          <input
            type="range"
            min={MIN_ELEMENTS}
            max={MAX_VISUALIZE}
            value={count}
            onChange={(e) => {
              const n = Number(e.target.value);
              setCount(n);
              generate(n);
            }}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-[11px] text-obsidian-muted tabular-nums">
            <span>{MIN_ELEMENTS}</span>
            <span>{MAX_VISUALIZE}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-obsidian-muted">Prędkość</span>
            <span className="text-obsidian-text font-medium">
              {delay <= 150 ? "szybko" : delay >= 500 ? "wolno" : "średnio"}
            </span>
          </div>
          <input
            type="range"
            min={D_MIN}
            max={D_MAX}
            step={20}
            value={D_MIN + D_MAX - delay}
            onChange={(e) => setDelay(D_MIN + D_MAX - Number(e.target.value))}
            className="w-full accent-violet-500"
          />
        </div>

        <button
          onClick={() => generate()}
          className="w-full px-3 py-2 rounded-lg border border-obsidian-border text-sm hover:border-violet-500"
        >
          Generuj losowe
        </button>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-xs text-obsidian-muted">Dane (ręcznie)</label>
            <span className="text-[11px] text-obsidian-muted tabular-nums">
              {parsedCount} / {MAX_VISUALIZE}
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder="np. 5, 3, 8, 1 — oddziel spacją, przecinkiem lub nową linią"
            className="w-full px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm font-mono resize-y"
          />
        </div>

        <button
          onClick={run}
          disabled={status === "loading"}
          className="w-full px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
        >
          {status === "loading" ? "Liczę…" : "Uruchom"}
        </button>

        {status === "error" && (
          <p className="text-red-400 text-xs">
            Nie udało się uruchomić. Sprawdź dane (liczby całkowite) i czy backend działa.
          </p>
        )}
      </aside>
    </div>
  );
}