import { Link } from "react-router";
import { useAuth } from "../lib/auth.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Wizualizacja algorytmów
      </h1>
      <p className="text-obsidian-muted max-w-xl mx-auto mb-8">
        Wybierz algorytm i obserwuj jego działanie krok po kroku.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/algorithms"
          className="inline-block px-6 py-3 rounded-lg bg-violet-700 text-white font-medium hover:bg-violet-600 transition-colors shadow-lg shadow-violet-900/40"
        >
          Przeglądaj algorytmy
        </Link>
        {user?.isAdmin && (
          <a
            href="/Admin"
            className="inline-block px-6 py-3 rounded-lg border border-violet-500 text-violet-300 font-medium hover:bg-violet-600/10 transition-colors"
          >
            Panel administratora (CRUD)
          </a>
        )}
      </div>
    </section>
  );
}