# Algorithms Visualizer

Interaktywna aplikacja webowa do wizualizacji algorytmów sortowania, przeszukiwania grafów i struktur danych.

Algorytmy są wykonywane po stronie serwera w ASP.NET Core, a frontend napisany w React odpowiada za animowanie kolejnych kroków działania algorytmu. Dzięki temu backend faktycznie realizuje logikę algorytmiczną, a frontend służy do prezentacji wyników w interaktywnej formie.

---

## Stack technologiczny

- **Backend:** ASP.NET Core MVC / C#
- **Frontend:** React + Vite
- **Baza danych:** SQLite (Entity Framework Core)
- **Styling:** Tailwind CSS
- **Kontrola wersji:** Git

### Testowane środowisko

- **.NET SDK:** 10.0.204 lub nowszy
- **Node.js:** 20.x lub nowszy
- **npm:** 10.x lub nowszy
- **Git:** dowolna aktualna wersja

Podane wersje odpowiadają środowisku, w którym projekt był tworzony i testowany. Nowsze wersje powinny działać poprawnie, ale nie były osobno testowane.

---

## Wymagania wstępne

Przed uruchomieniem projektu należy zainstalować:

### .NET SDK 10+

Pobieranie: <https://dotnet.microsoft.com/en-us/download>

Sprawdzenie wersji:

```bash
dotnet --version
```

### Node.js 20+

Pobieranie: <https://nodejs.org/>

Sprawdzenie wersji:

```bash
node --version
npm --version
```

### Git

Pobieranie: <https://git-scm.com/downloads>

Sprawdzenie wersji:

```bash
git --version
```

---

## Uruchomienie projektu

### 1. Sklonowanie repozytorium

```bash
git clone https://github.com/SorryTea/algo-lab.git
cd algo-lab
```

### 2. Przygotowanie bazy danych

Aplikacja używa SQLite. Plik bazy nie jest w repozytorium — zostanie utworzony lokalnie przy pierwszym uruchomieniu backendu. Migracje i dane startowe są aplikowane automatycznie.

**Nic nie trzeba robić ręcznie - przejdź do kroku 3.**

<details>
<summary>Opcjonalnie: ręczna inicjalizacja bazy</summary>

Jeśli chcesz utworzyć bazę przed uruchomieniem aplikacji:

```bash
cd algorithms-visualizer
dotnet tool install --global dotnet-ef
dotnet ef database update
```

</details>

### 3. Uruchomienie backendu

W pierwszym terminalu:

```bash
cd algorithms-visualizer
dotnet restore
dotnet run --launch-profile https
```

Backend uruchomi się pod adresami:

- **HTTP:** <http://localhost:5192>
- **HTTPS:** <https://localhost:7027>

### 4. Uruchomienie frontendu

W drugim terminalu:

```bash
cd algorithms-visualizer/frontend
npm install
npm run dev
```

Frontend uruchomi się pod adresem:

- <http://localhost:5173>

Vite jest skonfigurowany z proxy - zapytania do `/api/*` są automatycznie przekierowywane do backendu na porcie 5192.

---

## Opis działania aplikacji

Aplikacja pozwala użytkownikowi wybrać algorytm oraz dane wejściowe, a następnie obserwować jego działanie krok po kroku w formie animacji.

Główne funkcjonalności:

- wizualizacja algorytmów sortowania (Bubble Sort, Merge Sort, Quick Sort i inne),
- wizualizacja przeszukiwania grafów (BFS, DFS),
- prezentacja działania struktur danych,
- panel administracyjny do zarządzania treścią opisów algorytmów,
- historia uruchomień zalogowanych użytkowników.

Backend implementuje algorytmy i zwraca sekwencję kroków jako JSON. Frontend interpretuje te kroki i animuje je użytkownikowi.

---

## Struktura projektu

```text
algo-lab/
├── .vscode/                          # Konfiguracja VS Code (extensions, tasks)
├── algorithms-visualizer/            # Projekt ASP.NET Core MVC
│   ├── Controllers/                  # Kontrolery API i MVC
│   ├── Models/                       # Modele encji (Algorithm, Category, ExecutionLog)
│   ├── Data/                         # AppDbContext (Entity Framework Core)
│   ├── Services/                     # Implementacje algorytmów
│   ├── Views/                        # Widoki Razor (panel admina)
│   ├── Properties/                   # launchSettings.json
│   ├── wwwroot/                      # Pliki statyczne
│   ├── frontend/                     # Projekt React + Vite
│   │   ├── public/                   # Pliki statyczne frontendu
│   │   ├── src/                      # Kod źródłowy React
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js            # Konfiguracja Vite z proxy do backendu
│   ├── appsettings.json              # Konfiguracja aplikacji
│   ├── Program.cs                    # Punkt wejścia ASP.NET
│   └── algorithms-visualizer.csproj
├── .gitignore
└── README.md
```

---

## Autorzy

Projekt wykonany w ramach zajęć akademickich.

- Yaroslav Khomko
- Uladzimir Kazekevich
