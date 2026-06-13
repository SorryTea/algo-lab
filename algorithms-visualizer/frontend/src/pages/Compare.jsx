import { useEffect, useState } from "react";
import { getAlgorithms, compareAlgorithms } from "../lib/api";
import {
  MIN_ELEMENTS,
  MAX_COMPARE,
  parseNumbers,
  randomArray,
  formatDuration,
} from "../lib/visualization";

const DEFAULT_SIZE = 20;

export default function Compare() {
  const [sortingAlgos, setSortingAlgos] = useState([]);
  const [listStatus, setListStatus] = useState("loading");
  const [selected, setSelected] = useState([]);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [inputText, setInputText] = useState(() => randomArray(DEFAULT_SIZE).join(", "));
  const [runStatus, setRunStatus] = useState("idle");
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getAlgorithms()
      .then((data) => {
        if (cancelled) return;
        const sorting = data.filter((a) => a.category?.slug === "sorting");
        setSortingAlgos(sorting);
        setSelected(sorting.slice(0, 2).map((a) => a.name));
        setListStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setListStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(name) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  function changeSize(n) {
    setSize(n);
    setInputText(randomArray(n).join(", "));
  }

  async function run() {
    const data = parseNumbers(inputText).slice(0, MAX_COMPARE);
    if (selected.length < 2 || data.length === 0) {
      setRunStatus("error");
      setResult(null);
      return;
    }
    setRunStatus("loading");
    try {
      const res = await compareAlgorithms(selected, data);
      setResult(res);
      setRunStatus("ready");
    } catch {
      setRunStatus("error");
      setResult(null);
    }
  }

  if (listStatus === "loading") {
    return <p className="text-obsidian-muted">Ładowanie algorytmów…</p>;
  }

  if (listStatus === "error") {
    return (
      <p className="text-red-400">
        Nie udało się pobrać listy algorytmów. Sprawdź, czy backend działa na porcie 5192.
      </p>
    );
  }

  const parsedCount = parseNumbers(inputText).slice(0, MAX_COMPARE).length;
  const valid = (result?.results ?? []).filter((r) => !r.error);
  const minSteps = valid.length ? Math.min(...valid.map((r) => r.totalSteps)) : 0;
  const maxSteps = valid.length ? Math.max(...valid.map((r) => r.totalSteps)) : 0;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Porównanie algorytmów</h1>
        <p className="text-obsidian-muted max-w-2xl">
          Wybierz co najmniej dwa algorytmy sortowania i te same dane wejściowe.
          Backend uruchomi każdy z nich na tej samej tablicy i zwróci liczbę kroków
          oraz czas wykonania, dzięki czemu można porównać ich wydajność.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-obsidian-muted">Algorytmy</h2>
        <div className="flex flex-wrap gap-2">
          {sortingAlgos.map((a) => {
            const active = selected.includes(a.name);
            return (
              <button
                key={a.id}
                onClick={() => toggle(a.name)}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                  active
                    ? "border-violet-500 bg-violet-600 text-white"
                    : "border-obsidian-border bg-obsidian-elevated text-obsidian-muted hover:border-violet-500"
                }`}
              >
                {a.displayName}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-obsidian-muted">Dane wejściowe</h2>

        {/* Suwak rozmiaru — tak samo jak w wizualizatorze */}
        <div className="space-y-2 max-w-md">
          <div className="flex justify-between text-sm">
            <span className="text-obsidian-muted">Rozmiar losowych danych</span>
            <span className="text-obsidian-text font-medium tabular-nums">{size}</span>
          </div>
          <input
            type="range"
            min={MIN_ELEMENTS}
            max={MAX_COMPARE}
            value={size}
            onChange={(e) => changeSize(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-[11px] text-obsidian-muted tabular-nums">
            <span>{MIN_ELEMENTS}</span>
            <span>{MAX_COMPARE}</span>
          </div>
        </div>

        {}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-xs text-obsidian-muted">Dane (ręcznie)</label>
            <span className="text-[11px] text-obsidian-muted tabular-nums">
              {parsedCount} / {MAX_COMPARE}
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

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => changeSize(size)}
            className="px-3 py-2 rounded-lg border border-obsidian-border text-sm hover:border-violet-500"
          >
            Losuj
          </button>
          <button
            onClick={run}
            disabled={runStatus === "loading"}
            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 disabled:opacity-50"
          >
            {runStatus === "loading" ? "Liczę…" : "Porównaj"}
          </button>
        </div>

        {runStatus === "error" && (
          <p className="text-red-400 text-sm">
            Wybierz co najmniej dwa algorytmy i podaj poprawne dane (liczby całkowite).
          </p>
        )}
      </section>

      {result && (
        <section className="space-y-4">
          <p className="text-sm text-obsidian-muted">
            Rozmiar danych: {result.inputSize} elementów
          </p>

          <div className="overflow-x-auto rounded-xl border border-obsidian-border">
            <table className="w-full text-sm">
              <thead className="bg-obsidian-surface text-obsidian-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Algorytm</th>
                  <th className="text-left px-4 py-3 font-medium">Złożoność</th>
                  <th className="text-right px-4 py-3 font-medium">Kroki</th>
                  <th className="text-right px-4 py-3 font-medium">Czas</th>
                  <th className="px-4 py-3 font-medium w-1/3">Porównanie kroków</th>
                </tr>
              </thead>
              <tbody>
                {result.results.map((r) => {
                  if (r.error) {
                    return (
                      <tr key={r.algorithmName} className="border-t border-obsidian-border">
                        <td className="px-4 py-3">{r.displayName}</td>
                        <td className="px-4 py-3 text-red-400" colSpan={4}>
                          {r.error}
                        </td>
                      </tr>
                    );
                  }
                  const best = r.totalSteps === minSteps;
                  const width = maxSteps > 0 ? (r.totalSteps / maxSteps) * 100 : 0;
                  return (
                    <tr key={r.algorithmName} className="border-t border-obsidian-border">
                      <td className="px-4 py-3 font-medium">
                        {r.displayName}
                        {best && (
                          <span className="ml-2 text-xs text-emerald-400">najmniej kroków</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-obsidian-muted font-mono">{r.timeComplexity}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{r.totalSteps}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-obsidian-muted">
                        {formatDuration(r.executionTimeMicroseconds)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-2 rounded-full bg-obsidian-surface overflow-hidden">
                          <div
                            className={`h-full rounded-full ${best ? "bg-emerald-500" : "bg-violet-500"}`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-obsidian-muted">
            Mniej kroków oznacza mniej operacji na danych. Czas mierzony jest na backendzie
            i może się nieznacznie różnić między uruchomieniami.
          </p>
        </section>
      )}
    </div>
  );
}