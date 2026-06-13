# Dokumentacja techniczna - Algorithms Visualizer

## Architektura ogólna

Aplikacja składa się z trzech warstw:

- **Frontend (React SPA)** - interfejs użytkownika, animacje wizualizacji algorytmów
- **Backend (ASP.NET Core MVC)** - logika algorytmów, REST API, panel administracyjny
- **Baza danych (SQLite + Entity Framework Core)** - przechowuje opisy algorytmów, kategorie i historię uruchomień

Algorytmy nie są implementowane po stronie frontendu - to backend w C# wykonuje algorytm krok po kroku i zwraca sekwencję stanów jako JSON. Frontend pełni rolę odtwarzacza tej sekwencji: pobiera kroki z API i animuje je użytkownikowi.

Komunikacja przebiega w obu kierunkach: frontend wysyła dane wejściowe (np. tablicę do posortowania) do backendu, a backend zwraca wyniki obliczeń i loguje uruchomienie do bazy danych.

```
[ React SPA ] ---HTTP/JSON---> [ ASP.NET Core API ] ---EF Core---> [ SQLite ]
   :5173                          :5192                              app.db
```

## Stack i decyzje technologiczne

### Backend - ASP.NET Core MVC

Algorytmy o większej złożoności czasowej (np. O(n²) dla większych tablic) wymagają wydajnego środowiska wykonawczego. C# z runtime .NET zapewnia kompilację AOT i wysoką wydajność obliczeniową, co przekłada się na płynne działanie aplikacji nawet przy złożonych algorytmach. Dodatkowo ASP.NET Core jest preferowanym stackiem w specyfikacji projektu.

### Frontend - React + Vite

React to jeden z najpopularniejszych frameworków frontendowych. Pozwala na łatwe zarządzanie stanem komponentów wizualizacji (kroki algorytmu, podświetlane elementy tablicy) przez hooks. Vite zapewnia szybki dev-server z hot module replacement, co znacznie przyspiesza pracę nad UI.

### Baza danych - SQLite

Projekt nie wymaga obsługi wielu jednoczesnych użytkowników ani zaawansowanych funkcji bazy. SQLite jako baza plikowa eliminuje konieczność konfiguracji serwera - kolega po klonowaniu repo nie musi instalować PostgreSQL ani konfigurować haseł. Jeśli projekt rozwiniemy do produkcji, migracja do PostgreSQL wymaga tylko zmiany providera w `Program.cs` - EF Core abstrahuje warstwę bazy.

### ORM - Entity Framework Core

EF Core pozwala definiować schemat bazy przez klasy C# (Code First) i zarządzać zmianami przez migracje. Eliminuje pisanie ręcznego SQL i zapewnia type safety na poziomie zapytań LINQ. Jest standardem w ekosystemie .NET - znajomość EF Core przekłada się na pracę w większości projektów .NET.

### Styling - Tailwind CSS

Utility-first podejście Tailwinda przyspiesza budowanie responsywnych interfejsów - zamiast pisać własne klasy CSS i zarządzać arkuszami stylów, klasy aplikuje się bezpośrednio w JSX. Wbudowane breakpointy (`sm:`, `md:`, `lg:`) ułatwiają realizację wymogu pełnej responsywności (RWD) wymaganego przez specyfikację projektu.

```mermaid
erDiagram
    Category ||--o{ Algorithm : "contains"
    Category {
        int Id PK
        string Name
        string Slug
    }
    Algorithm {
        int Id PK
        string Name
        string DisplayName
        string Description
        string PseudoCode
        string TimeComplexity
        string SpaceComplexity
        bool IsVisible
        int CategoryId FK
    }
    ExecutionLog {
        int Id PK
        string AlgorithmName
        int InputSize
        int TotalSteps
        long ExecutionTimeMs
        datetime RanAt
    }
```

### Tabela `Category`

Przechowuje grupy algorytmów (np. _Sortowanie_, _Grafy_, _Wyszukiwanie_). Każda kategoria ma dwa pola tekstowe: `Name` to etykieta wyświetlana użytkownikowi (z polskimi znakami), `Slug` to URL-friendly wersja używana w trasach (np. `/categories/sorting`). Rozdzielenie nazwy i sluga to standardowy wzorzec w aplikacjach webowych - pozwala zmieniać widoczną nazwę bez psucia istniejących linków.

### Tabela `Algorithm`

Przechowuje definicje algorytmów: nazwę techniczną (`Name`), nazwę wyświetlaną (`DisplayName`), opis, pseudokod oraz złożoność czasową i pamięciową. Klucz obcy `CategoryId` łączy algorytm z kategorią (relacja many-to-one - wiele algorytmów może należeć do jednej kategorii). Pole `IsVisible` pozwala administratorowi tymczasowo ukryć algorytm bez jego usuwania z bazy - np. gdy opis jest niekompletny lub wymaga poprawek.

### Tabela `ExecutionLog`

Przechowuje historię uruchomień algorytmów: nazwę algorytmu, rozmiar danych wejściowych, liczbę wygenerowanych kroków, czas wykonania w milisekundach oraz datę uruchomienia. **Świadomie nie używamy klucza obcego do `Algorithm`** - zamiast tego trzymamy `AlgorithmName` jako string. Dzięki temu logi pozostają w bazie nawet po usunięciu algorytmu przez administratora, co pozwala zachować pełną historię analityczną aplikacji.

## API

API to kilka endpointów REST, które zwracają dane w JSON-ie. Korzysta z nich frontend React, np. żeby pobrać algorytmy, odpalić wizualizację albo porównać sortowania.

### Dostępne endpointy

| Metoda | Ścieżka                   | Opis                                                                                                         |
| ------ | ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| GET    | `/api/algorithms`         | Lista widocznych algorytmów razem z kategoriami.                                                             |
| GET    | `/api/algorithms/{id}`    | Szczegóły jednego algorytmu.                                                                                 |
| POST   | `/api/algorithms/execute` | Uruchamia algorytm i zwraca kroki animacji, liczbę kroków oraz czas wykonania. Zapisuje też wpis w historii. |
| POST   | `/api/algorithms/compare` | Porównuje algorytmy sortowania na tych samych danych i zwraca wyniki dla każdego z nich.                     |

### Architektura serwisów algorytmów

Algorytmy są podzielone na trzy grupy: sortowanie, wyszukiwanie i grafy. Każda grupa ma własny interfejs, więc kod nie miesza różnych typów algorytmów w jednym worku.

Każdy serwis implementuje odpowiedni interfejs:

- `ISortingAlgorithm` - algorytmy sortowania: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort
- `ISearchingAlgorithm` - algorytmy wyszukiwania: Binary Search
- `IGraphAlgorithm` - algorytmy grafowe: BFS, DFS

Serwisy są rejestrowane w Dependency Injection jako `Scoped`. `AlgorithmsController` dostaje listy `IEnumerable<I...>` i wybiera konkretny algorytm po polu `Name`, np. `bubble`, `dfs` albo `binary-search`. Dzięki temu nowy algorytm to głównie nowa klasa i wpis w `Program.cs`, a nie przepisywanie kontrolera.

### Walidacja i błędy

API używa zwykłych kodów HTTP:

- `200 OK` - wszystko się udało, zwracamy dane JSON
- `400 Bad Request` - brakuje danych albo request jest niepoprawny
- `404 Not Found` - nie ma algorytmu o takim `id` albo takiej nazwie

Kontroler sprawdza m.in. czy `InputData` nie jest puste, czy Binary Search ma `Target`, czy graf ma `Vertices`, `Edges` i `StartVertex`, oraz czy przy porównaniu podano `AlgorithmNames`.

### Pełna dokumentacja API

Pełna dokumentacja z parametrami i przykładami jest pod `/swagger` w trybie deweloperskim. Generuje ją automatycznie Swashbuckle.

## Algorytmy

W tym projekcie algorytmy to konkretne klasy w C#, które wykonują się po stronie serwera. Obecnie mamy 7 algorytmów: 4 sortowania, 1 wyszukiwania i 2 grafowe. Każdy z nich nie zwraca tylko końcowego wyniku, ale całą listę kroków, którą frontend może potem ładnie odtworzyć jako animację.

### Reprezentacja kroku - `AlgorithmStep`

Sortowanie i wyszukiwanie zwracają listę obiektów `AlgorithmStep`. Każdy krok opisuje jeden stan tablicy. Tablica jest klonowana przy każdym kroku, żeby frontend miał gotową "klatkę" animacji i mógł odtworzyć ją od dowolnego momentu.

Pola `AlgorithmStep`:

- `StepIndex` - numer kroku
- `Array` - aktualny stan tablicy
- `Comparing` - indeksy elementów, które są teraz sprawdzane
- `SortedIndices` - indeksy uznane za gotowe albo znalezione
- `Swapped` - informacja, czy w tym kroku była zamiana
- `Description` - krótki opis dla użytkownika

### Algorytmy sortowania

Wszystkie sortowania implementują `ISortingAlgorithm` i pracują na tablicy liczb:

- Bubble Sort - porównuje sąsiednie elementy i przepycha większe wartości na koniec
- Selection Sort - szuka najmniejszego elementu i wstawia go na właściwe miejsce
- Insertion Sort - buduje posortowaną część tablicy, dokładając elementy jeden po drugim
- Merge Sort - dzieli tablicę na mniejsze części, sortuje je i scala z powrotem

### Algorytmy wyszukiwania

Do wyszukiwania mamy Binary Search. Algorytm sprawdza środkowy element, a potem odrzuca połowę zakresu, więc działa szybko, ale zakłada posortowane dane. Ma osobny interfejs `ISearchingAlgorithm`, bo oprócz tablicy potrzebuje jeszcze wartości `Target`, czyli tego, czego szukamy.

### Algorytmy grafowe

Algorytmy grafowe to BFS i DFS. Używają osobnego DTO `GraphAlgorithmStep`, bo graf ma inne dane niż tablica: wierzchołki, krawędzie, odwiedzone elementy, kolejkę/stos jako `Frontier` i aktualny wierzchołek `Current`.

BFS wyszukuje sąsiadów prostym przejściem po krawędziach, więc jest czytelny, ale mniej wydajny (`O(V * E)`). DFS najpierw buduje listę sąsiedztwa, dzięki czemu działa wydajniej (`O(V + E)`). Fajnie to pokazuje różnicę między prostszą implementacją a bardziej zoptymalizowaną.

### Dodawanie nowego algorytmu

Dodanie nowego algorytmu jest dość proste:

1. Stwórz klasę implementującą odpowiedni interfejs
2. Zaimplementuj `Execute`, tak żeby generowało kroki animacji
3. Zarejestruj serwis w `Program.cs` przez `AddScoped`
4. Dodaj wpis w `DbSeeder`, jeśli algorytm ma być widoczny w UI

Kontrolera zwykle nie trzeba ruszać, bo dostaje automatycznie wszystkie implementacje przez Dependency Injection.

## Panel administracyjny

Panel administracyjny to część aplikacji dla osoby zarządzającej projektem. Jest zrobiony w klasycznych widokach Razor/MVC, a nie w React, bo to prostsze przy formularzach, autoryzacji i pracy z panelem admina. Frontend React zostaje głównie od wizualizacji algorytmów.

### Autoryzacja

Logowanie i role są oparte o ASP.NET Identity. Klasa `AppUser` rozszerza `IdentityUser` o dwa pola: `AvatarPath` i `Nickname`. Przy starcie aplikacji seedowane jest konto admina `admin@local` z hasłem `Admin123` oraz rola `Admin`. Zwykłe konta po rejestracji działają jak normalni użytkownicy bez dostępu do panelu admina.

Cały `AdminController` ma atrybut `[Authorize(Roles = "Admin")]`, więc bez roli admina nie da się wejść do tych akcji. To trzyma logikę dostępu w jednym miejscu i nie trzeba sprawdzać uprawnień ręcznie w każdej metodzie.

### Funkcjonalności

Admin może zobaczyć dashboard ze statystykami: liczbą algorytmów, kategorii i uruchomień. Może też zarządzać algorytmami, czyli edytować ich metadane, przełączać `IsVisible` i usuwać wpisy. Jest też lista użytkowników z możliwością banowania przez ustawienie `LockoutEnd`.

Zmiana nicku i avatara jest dostępna w profilu użytkownika. Dzięki temu konto może mieć prostą personalizację bez dokładania osobnego panelu tylko do profilu.

### Profil użytkownika

Profil jest oparty o scaffoldowaną stronę Identity `Manage/Index`. Użytkownik może tam zmienić `Nickname` i wgrać avatar. Upload przyjmuje pliki PNG, JPG, GIF i WEBP, maksymalnie do 2 MB.

Nazwa pliku avatara jest generowana przez `Guid`, więc nie ma konfliktów nazw. Po wgraniu nowego avatara stary plik jest usuwany z dysku. Pliki trafiają do `wwwroot/uploads/avatars/` i są potem serwowane jak zwykłe statyczne zasoby aplikacji.

### Bezpieczeństwo

W formularzach POST używany jest `AntiForgeryToken`, więc mamy ochronę przed CSRF. Przy avatarach sprawdzane są rozszerzenie pliku i rozmiar, a admin nie może zbanować sam siebie. Hasła nie są trzymane jako zwykły tekst, tylko obsługuje je ASP.NET Identity, które domyślnie hashuje je algorytmem PBKDF2.

## Frontend

Frontend to publiczna część aplikacji, czyli strona główna, lista algorytmów i same wizualizacje. Jest zrobiony w React + Vite + Tailwind CSS. Z backendem rozmawia przez REST API, więc React nie liczy algorytmów sam, tylko pobiera gotowe kroki animacji.

### Architektura

Projekt jest podzielony na `pages` i `components`. Routing obsługuje React Router v7. Główny `Layout` działa jak wspólna ramka strony: ma navbar, footer i miejsce na aktualną stronę przez `Outlet`.

Najważniejsze strony to `Home`, `Algorithms`, `Visualizer`, `About` i `NotFound`. W komponentach są m.in. `Navbar`, `Layout`, `SortVisualizer`, `SearchVisualizer` i `GraphVisualizer`.

### Komunikacja z API

Warstwa `lib/api.js` trzyma funkcje do zapytań `fetch`, dzięki czemu komponenty nie muszą znać dokładnych endpointów. Vite ma proxy dla `/api`, które w trybie dev przekierowuje requesty na backend pod `https://localhost:7027`.

Stan w komponentach jest ogarniany przez `useState` i `useEffect`. Widoki mają proste statusy typu `loading`, `error` i `ready`, więc użytkownik widzi, czy dane się ładują, czy coś poszło nie tak.

### Wizualizacje

Wizualizacje pobierają kroki z `/api/algorithms/execute` i odtwarzają je z wybraną prędkością. `SortVisualizer` pokazuje sortowanie jako słupki: inne kolory oznaczają elementy porównywane i już posortowane. Ma też kontrolki typu odtwórz, pauza, krok i reset.

`SearchVisualizer` działa podobnie, ale jest pod Binary Search: pokazuje sprawdzany element i znaleziony wynik. `GraphVisualizer` rysuje graf jako wierzchołki w okręgu i krawędzie między nimi. Kolory pokazują aktualny wierzchołek, odwiedzone elementy i kolejkę/stos jako `frontier`.

### Styling

Styling jest oparty głównie o Tailwind CSS, czyli klasy utility pisane bezpośrednio w JSX. Projekt ma własną ciemną paletę `obsidian`, a głównym kolorem akcentu jest violet. Responsywność robimy przez breakpointy Tailwinda, np. `sm:`, `md:` i `lg:`.

## Forum

Forum to część aplikacji, w której użytkownicy mogą zadawać pytania, zgłaszać błędy i proponować nowe funkcje albo algorytmy. Odczyt postów jest publiczny, więc niezalogowany użytkownik może przeglądać dyskusje, ale tworzenie postów i komentarzy wymaga konta. Dzięki temu forum działa jako lekka warstwa społecznościowa obok samych wizualizacji.

### Model danych

Forum ma trzy główne encje. `ForumCategory` przechowuje kategorie tematyczne przez pola `Name` i `Slug`, podobnie jak kategorie algorytmów - nazwa jest dla użytkownika, a slug do filtrowania i URL-i. `ForumPost` opisuje pojedynczy post: ma `Title`, `Content`, `CreatedAt`, `CategoryId` oraz `AuthorId`. `ForumComment` przechowuje komentarze pod postami przez `Content`, `CreatedAt`, `PostId` i `AuthorId`.

Posty i komentarze mają referencję do `AppUser`, więc można pokazać autora, avatar i nick bez kopiowania tych danych do tabel forum. Komentarze są zależne od posta - usunięcie posta usuwa też jego komentarze przez cascade, dzięki czemu w bazie nie zostają osierocone wpisy.

### Endpoints API

| Metoda | Ścieżka                          | Opis                                                                                           | Wymaga loginu         |
| ------ | -------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------- |
| GET    | `/api/forum/categories`          | Zwraca listę kategorii forum z `Id`, `Name` i `Slug`.                                          | nie                   |
| GET    | `/api/forum/posts?categorySlug=` | Zwraca listę postów, opcjonalnie filtrowaną po slugu kategorii.                                | nie                   |
| GET    | `/api/forum/posts/{id}`          | Zwraca szczegóły jednego posta razem z komentarzami.                                           | nie                   |
| POST   | `/api/forum/posts`               | Tworzy nowy post w wybranej kategorii i zwraca jego `id`.                                      | tak                   |
| POST   | `/api/forum/posts/{id}/comments` | Dodaje komentarz do istniejącego posta i zwraca `id` komentarza.                               | tak                   |
| DELETE | `/api/forum/posts/{id}`          | Usuwa post, jeśli aktualny użytkownik jest jego autorem albo ma rolę admina.                   | tak (admin lub autor) |

### Autoryzacja w API forum

Publiczne endpointy `GET` są dostępne dla każdego, bo forum ma być czytelne bez zakładania konta. Akcje `POST` i `DELETE` mają atrybut `[Authorize]`, więc wymagają zalogowanego użytkownika. Login z Reacta obsługuje `AccountController` przez `POST /api/account/login`, a sesja jest dzielona z widokami Razor przez to samo cookie ASP.NET Identity.

Przy tworzeniu posta albo komentarza backend pobiera aktualnego użytkownika z `UserManager<AppUser>` i zapisuje jego `Id` jako autora. Przy usuwaniu posta kontroler sprawdza dwa warunki: czy użytkownik ma rolę `Admin`, albo czy `AuthorId` posta jest takie samo jak `Id` aktualnego użytkownika. Jeśli nie spełnia żadnego z nich, API zwraca `403 Forbidden`.

### Moderacja w panelu admin

Admin ma osobną zakładkę **Posty forum** w `/Admin`, gdzie widzi wszystkie posty razem z autorem, kategorią, liczbą komentarzy i datą utworzenia. Z tego miejsca może usuwać posty niezależnie od autora. Usunięcie posta kasuje również jego komentarze, więc moderacja nie wymaga dodatkowego sprzątania powiązanych rekordów.

Ten widok jest zrobiony tak samo jak reszta panelu administracyjnego: klasyczne Razor Views + Bootstrap. Dzięki temu forum nie wprowadza osobnego stylu panelu admina i zostaje spójne z zarządzaniem algorytmami, kategoriami, logami i użytkownikami.

### DTO i bezpieczeństwo

API forum zwraca DTO zamiast bezpośrednio serializować encje EF Core. To ważne szczególnie przy relacji z `AppUser`, bo obiekt użytkownika zawiera pola techniczne Identity, których frontend nie powinien dostać, np. `PasswordHash` albo `SecurityStamp`.

DTO upraszczają też dane dla Reacta. Nick autora jest składany po stronie backendu: jeśli użytkownik ma `Nickname`, API zwraca nick, a jeśli go nie ma, używa lokalnej części adresu email. Lista postów zwraca `CommentsCount` zamiast całej listy komentarzy, dzięki czemu odpowiedź jest lekka i wystarcza do widoku listy. Pełne komentarze są pobierane dopiero w szczegółach posta.

Requesty do tworzenia postów i komentarzy mają osobne klasy (`CreatePostRequest`, `CreateCommentRequest`) z walidacją przez DataAnnotations. `Required` pilnuje wymaganych pól, a `MaxLength` ogranicza długość tytułu, treści posta i treści komentarza już na wejściu do API.
