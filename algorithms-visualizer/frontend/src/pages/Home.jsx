import { Link } from "react-router";

export default function Home() {
  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Wizualizacja algorytmów
      </h1>
      <p className="text-obsidian-muted max-w-xl mx-auto mb-8">
        Wybierz algorytm i obserwuj jego działanie krok po kroku.
      </p>
      <Link
        to="/algorithms"
        className="inline-block px-6 py-3 rounded-lg bg-violet-700 text-white font-medium hover:bg-violet-600 transition-colors shadow-lg shadow-violet-900/40"
      >
        Przeglądaj algorytmy
      </Link>
    </section>
  );
}