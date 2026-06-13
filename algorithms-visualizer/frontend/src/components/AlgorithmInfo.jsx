import { getAlgorithmInfo } from "../lib/algorithmInfo";

export default function AlgorithmInfo({ name }) {
  const info = getAlgorithmInfo(name);
  if (!info) return null;

  const { howItWorks, complexity, stable, inPlace, requires, pros, cons, useCases } = info;

  return (
    <div className="space-y-6">
      {howItWorks && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Jak to działa</h2>
          <p className="text-obsidian-text">{howItWorks}</p>
        </div>
      )}

      {complexity && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Złożoność czasowa</h2>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              ["Najlepszy", complexity.best],
              ["Średni", complexity.average],
              ["Najgorszy", complexity.worst],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-obsidian-border bg-obsidian-elevated px-3 py-2 text-center"
              >
                <div className="text-[11px] text-obsidian-muted">{label}</div>
                <div className="font-mono text-sm text-obsidian-text">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(stable != null || inPlace != null || requires) && (
        <div className="flex flex-wrap gap-2">
          {stable != null && <Badge ok={stable}>{stable ? "Stabilny" : "Niestabilny"}</Badge>}
          {inPlace != null && (
            <Badge ok={inPlace}>{inPlace ? "Sortuje w miejscu" : "Wymaga dodatkowej pamięci"}</Badge>
          )}
          {requires && <Badge ok={null}>Wymaga: {requires}</Badge>}
        </div>
      )}

      {(pros?.length || cons?.length) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {pros?.length > 0 && (
            <div className="rounded-xl border border-obsidian-border bg-obsidian-surface p-4">
              <h3 className="text-sm font-semibold text-emerald-400 mb-2">Zalety</h3>
              <ul className="space-y-1 text-sm text-obsidian-text">
                {pros.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-400">+</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cons?.length > 0 && (
            <div className="rounded-xl border border-obsidian-border bg-obsidian-surface p-4">
              <h3 className="text-sm font-semibold text-red-400 mb-2">Wady</h3>
              <ul className="space-y-1 text-sm text-obsidian-text">
                {cons.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-400">−</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {useCases && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Zastosowania</h2>
          <p className="text-obsidian-muted">{useCases}</p>
        </div>
      )}
    </div>
  );
}

function Badge({ ok, children }) {
  const tone =
    ok === true
      ? "border-emerald-500/40 text-emerald-400"
      : ok === false
      ? "border-red-500/40 text-red-400"
      : "border-obsidian-border text-obsidian-muted";
  return (
    <span className={`px-3 py-1 rounded-full border text-xs ${tone}`}>{children}</span>
  );
}