export const ALGORITHM_INFO = {
  bubble: {
    howItWorks:
      "Wielokrotnie przechodzi po tablicy i zamienia sąsiednie elementy, jeśli są w złej kolejności. Po każdym przebiegu największy element „wypływa” na koniec.",
    complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    stable: true,
    inPlace: true,
    pros: ["Bardzo prosty do zrozumienia i implementacji", "Stabilny", "Sortuje w miejscu"],
    cons: ["Bardzo wolny na dużych danych (O(n²))", "Wykonuje dużo zamian"],
    useCases: "Nauka, małe lub prawie posortowane zbiory.",
  },
  selection: {
    howItWorks:
      "W każdym przebiegu znajduje najmniejszy element w nieposortowanej części i ustawia go na właściwym miejscu na początku.",
    complexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    stable: false,
    inPlace: true,
    pros: ["Mała liczba zamian — O(n)", "Prosty", "Sortuje w miejscu"],
    cons: ["Zawsze O(n²), nawet dla posortowanych danych", "Niestabilny"],
    useCases: "Gdy zapis do pamięci jest kosztowny (mało zamian), oraz do nauki.",
  },
  insertion: {
    howItWorks:
      "Buduje posortowaną część od lewej strony, wstawiając każdy kolejny element w odpowiednie miejsce wśród już posortowanych.",
    complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    stable: true,
    inPlace: true,
    pros: [
      "Szybki dla małych i prawie posortowanych danych",
      "Stabilny, sortuje w miejscu",
      "Działa „online” — może sortować dane w trakcie napływania",
    ],
    cons: ["O(n²) na dużych, losowych danych"],
    useCases: "Małe zbiory, dane prawie posortowane, część szybszych algorytmów hybrydowych.",
  },
  merge: {
    howItWorks:
      "Dzieli tablicę na połowy, sortuje każdą rekurencyjnie, a następnie scala posortowane połowy w jedną całość.",
    complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    stable: true,
    inPlace: false,
    pros: ["Gwarantowane O(n log n) w każdym przypadku", "Stabilny", "Przewidywalny czas"],
    cons: ["Wymaga dodatkowej pamięci O(n)", "Nie sortuje w miejscu"],
    useCases: "Duże zbiory, sortowanie zewnętrzne, gdy potrzebna jest stabilność.",
  },
  "binary-search": {
    howItWorks:
      "Porównuje szukaną wartość ze środkowym elementem i za każdym razem o połowę zawęża zakres przeszukiwania.",
    complexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    requires: "Posortowane dane wejściowe",
    pros: ["Bardzo szybkie — O(log n)", "Proste w implementacji"],
    cons: ["Działa tylko na posortowanej tablicy"],
    useCases: "Szybkie wyszukiwanie w posortowanych zbiorach.",
  },
  bfs: {
    howItWorks:
      "Odwiedza wierzchołki warstwami, zaczynając od źródła i używając kolejki — najpierw wszystkich sąsiadów, potem ich sąsiadów.",
    complexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    pros: ["Znajduje najkrótszą ścieżkę w grafie nieważonym", "Przewidywalny porządek warstwami"],
    cons: ["Zużywa pamięć na kolejkę — O(V)"],
    useCases: "Najkrótsza ścieżka w grafie nieważonym, przeszukiwanie poziomami.",
  },
  dfs: {
    howItWorks:
      "Schodzi jak najgłębiej jedną ścieżką, a po napotkaniu ślepego zaułka cofa się i próbuje inną (stos lub rekurencja).",
    complexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    pros: ["Mniejsze zużycie pamięci niż BFS", "Naturalny dla rekurencji", "Wykrywanie cykli, sortowanie topologiczne"],
    cons: ["Nie gwarantuje najkrótszej ścieżki"],
    useCases: "Przeszukiwanie grafu, wykrywanie cykli, sortowanie topologiczne, spójne składowe.",
  },
};

export function getAlgorithmInfo(name) {
  return ALGORITHM_INFO[name] ?? null;
}