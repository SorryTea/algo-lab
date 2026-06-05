import { Link } from "react-router";

const CATEGORIES = [
  {
    name: "Sortowanie",
    algorithms: [
      { slug: "bubble-sort", name: "Bubble Sort" },
      { slug: "merge-sort", name: "Merge Sort" },
      { slug: "quick-sort", name: "Quick Sort" },
    ],
  },
  {
    name: "Grafy",
    algorithms: [
      { slug: "bfs", name: "BFS" },
      { slug: "dfs", name: "DFS" },
    ],
  },
];

export default function Algorithms() {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Algorytmy</h1>
      {CATEGORIES.map((cat) => (
        <section key={cat.name}>
          <h2 className="text-xl font-semibold mb-4 text-obsidian-muted">
            {cat.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.algorithms.map((algo) => (
              <Link
                key={algo.slug}
                to={`/algorithms/${algo.slug}`}
                className="block p-5 rounded-xl border border-obsidian-border bg-obsidian-elevated hover:border-violet-500 hover:shadow-lg hover:shadow-violet-900/30 transition-all"
              >
                <span className="font-medium">{algo.name}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}