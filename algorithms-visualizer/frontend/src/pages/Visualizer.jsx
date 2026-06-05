import { useParams, Link } from "react-router";

export default function Visualizer() {
  const { slug } = useParams();

  return (
    <div>
      <Link to="/algorithms" className="text-sm text-indigo-600 hover:underline">
        ← Wróć do listy
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-2 capitalize">
        {slug?.replace("-", " ")}
      </h1>
      <p className="text-slate-600">
        Tu pojawi się wizualizacja algorytmu (kolejny etap projektu).
      </p>
      <div className="mt-8 h-64 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
        Obszar wizualizacji
      </div>
    </div>
  );
}