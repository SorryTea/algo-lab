import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getAlgorithm } from "../lib/api";

export default function Visualizer() {
  const { id } = useParams();
  const [algorithm, setAlgorithm] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getAlgorithm(id)
      .then((data) => {
        if (!cancelled) {
          setAlgorithm(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div>
      <Link to="/algorithms" className="text-sm text-violet-400 hover:underline">
        ← Wróć do listy
      </Link>

      {status === "loading" && <p className="mt-4 text-obsidian-muted">Ładowanie…</p>}
      {status === "error" && <p className="mt-4 text-red-400">Nie znaleziono algorytmu.</p>}

      {status === "ready" && algorithm && (
        <>
          <h1 className="text-3xl font-bold mt-4 mb-1">{algorithm.displayName}</h1>
          <p className="text-obsidian-muted mb-6">
            Złożoność czasowa: {algorithm.timeComplexity} · pamięciowa: {algorithm.spaceComplexity}
          </p>
          <p className="mb-6">{algorithm.description}</p>

          <h2 className="text-lg font-semibold mb-2">Pseudokod</h2>
          <pre className="p-4 rounded-xl border border-obsidian-border bg-obsidian-elevated overflow-x-auto text-sm whitespace-pre-wrap">
            {algorithm.pseudoCode}
          </pre>

          <div className="mt-8 h-64 rounded-xl border-2 border-dashed border-obsidian-border flex items-center justify-center text-obsidian-muted">
            Obszar wizualizacji (kolejny etap)
          </div>
        </>
      )}
    </div>
  );
}