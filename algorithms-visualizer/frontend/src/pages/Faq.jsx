import { useState } from "react";

const faqs = [
  {
    q: "Czym jest Algorithms Visualizer?",
    a: "To aplikacja edukacyjna do interaktywnej nauki algorytmów. Pozwala wybrać algorytm i obserwować jego działanie krok po kroku w formie animacji.",
  },
  {
    q: "Czy algorytmy wykonują się w przeglądarce?",
    a: "Nie. Algorytmy wykonuje backend napisany w ASP.NET Core, który zwraca sekwencję kroków jako dane JSON. Frontend w React odtwarza i animuje te kroki, dlatego logika algorytmiczna pozostaje po stronie serwera.",
  },
  {
    q: "Jakie algorytmy są dostępne?",
    a: "Sortowanie (bąbelkowe, przez wybieranie, przez wstawianie, przez scalanie), wyszukiwanie binarne oraz przeszukiwanie grafów wszerz (BFS) i w głąb (DFS). Lista może rosnąć, bo treść opisów jest zarządzana przez panel administracyjny.",
  },
  {
    q: "Jak działa porównanie algorytmów?",
    a: "Na stronie Porównaj wybierasz co najmniej dwa algorytmy sortowania i wspólne dane wejściowe. Backend uruchamia każdy z nich na tej samej tablicy i zwraca liczbę kroków oraz czas wykonania, dzięki czemu można zestawić ich wydajność.",
  },
  {
    q: "Co oznacza liczba kroków?",
    a: "Liczba kroków to liczba operacji, które algorytm wykonał na danych (porównania i przestawienia). Mniej kroków oznacza mniej pracy do wykonania na tym samym zbiorze danych.",
  },
  {
    q: "Jak zmienić dane wejściowe?",
    a: "W wizualizacji i w porównaniu jest pole tekstowe, w które wpisujesz liczby oddzielone przecinkami lub spacjami. Przycisk Losuj generuje przykładowy zestaw danych.",
  },
  {
    q: "Czy muszę się logować?",
    a: "Nie. Przeglądanie i wizualizacja algorytmów są dostępne bez konta. Logowanie i rejestracja obsługiwane są przez ASP.NET Identity, a dostęp do panelu administracyjnego wymaga odpowiedniej roli.",
  },
  {
    q: "Jaki jest stack technologiczny?",
    a: "Frontend: React, Vite i Tailwind CSS. Backend: ASP.NET Core MVC z Entity Framework Core i bazą SQLite. Kontrola wersji w Git.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(() => new Set());

  function toggle(i) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Najczęściej zadawane pytania</h1>
        <p className="text-obsidian-muted">
          Krótkie odpowiedzi na pytania o działanie aplikacji.
        </p>
      </header>

      <div className="space-y-3">
        {faqs.map((item, i) => {
          const isOpen = open.has(i);
          return (
            <div
              key={i}
              className="rounded-xl border border-obsidian-border bg-obsidian-elevated overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-obsidian-surface transition-colors"
              >
                <span className="font-medium">{item.q}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`shrink-0 text-obsidian-muted transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {isOpen && (
                <p className="px-5 pb-4 text-sm text-obsidian-muted leading-relaxed">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}