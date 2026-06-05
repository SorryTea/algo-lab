export default function About() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">O projekcie</h1>
      <p className="text-obsidian-muted">
        Aplikacja do interaktywnej wizualizacji algorytmów. Backend (ASP.NET
        Core) wykonuje algorytmy i zwraca kolejne kroki, a frontend (React) je
        animuje.
      </p>
    </div>
  );
}