import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAlgorithms } from "../lib/api";

export default function Algorithms() {
  const [algorithms, setAlgorithms] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready

  useEffect(() => {
    let cancelled = false;
    getAlgorithms()
      .then((data) => {
        if (!cancelled) {
          setAlgorithms(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return <p className="text-obsidian-muted">Ładowanie algorytmów…</p>;
  }

  if (status === "error") {
    return (
      <p className="text-red-400">
        Nie udało się pobrać listy. Sprawdź, czy backend działa na porcie 5192.
      </p>
    );
  }

  const groups = {};
  for (const algo of algorithms) {
    const catName = algo.category?.name ?? "Inne";
    if (!groups[catName]) groups[catName] = [];
    groups[catName].push(algo);
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Algorytmy</h1>
      {Object.entries(groups).map(([catName, items]) => (
        <section key={catName}>
          <h2 className="text-xl font-semibold mb-4 text-obsidian-muted">{catName}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((algo) => (
              <Link
                key={algo.id}
                to={`/algorithms/${algo.id}`}
                className="block p-5 rounded-xl border border-obsidian-border bg-obsidian-elevated hover:border-violet-500 hover:shadow-lg hover:shadow-violet-900/30 transition-all"
              >
                <span className="font-medium">{algo.displayName}</span>
                <span className="block mt-1 text-sm text-obsidian-muted">
                  {algo.timeComplexity}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}