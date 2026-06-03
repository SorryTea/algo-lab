import { Link } from "react-router";

export default function Home() {
  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Wizualizacja algorytmów
      </h1>
      <p className="text-slate-600 max-w-xl mx-auto mb-8">
        Wybierz algorytm i obserwuj jego działanie krok po kroku.
      </p>
      <Link
        to="/algorithms"
        className="inline-block px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
      >
        Przeglądaj algorytmy
      </Link>
    </section>
  );
}