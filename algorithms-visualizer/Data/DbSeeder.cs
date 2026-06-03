using algorithms_visualizer.Models;
using Microsoft.AspNetCore.Identity;

namespace algorithms_visualizer.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            if (context.Categories.Any())
                return;

            var sorting = new Category { Name = "Sortowanie", Slug = "sorting" };
            var graphs = new Category { Name = "Grafy", Slug = "graphs" };
            var searching = new Category { Name = "Wyszukiwanie", Slug = "searching" };

            context.Categories.AddRange(sorting, graphs, searching);
            context.SaveChanges();

            context.Algorithms.AddRange(
                new Algorithm
                {
                    Name = "bubble",
                    DisplayName = "Bubble Sort",
                    Description = "Prosty algorytm sortowania porównujący sąsiednie elementy i zamieniający je miejscami, dopóki cała kolekcja nie będzie uporządkowana.",
                    PseudoCode = "repeat\n  swapped = false\n  for i = 0 to n - 2\n    if array[i] > array[i + 1]\n      swap array[i], array[i + 1]\n      swapped = true\nuntil swapped == false",
                    TimeComplexity = "O(n^2)",
                    SpaceComplexity = "O(1)",
                    IsVisible = true,
                    CategoryId = sorting.Id
                },
                new Algorithm
                {
                    Name = "selection",
                    DisplayName = "Selection Sort",
                    Description = "Algorytm wybiera najmniejszy element z nieposortowanej części tablicy i przenosi go na początek tej części.",
                    PseudoCode = "for i = 0 to n - 2\n  minIndex = i\n  for j = i + 1 to n - 1\n    if array[j] < array[minIndex]\n      minIndex = j\n  swap array[i], array[minIndex]",
                    TimeComplexity = "O(n^2)",
                    SpaceComplexity = "O(1)",
                    IsVisible = true,
                    CategoryId = sorting.Id
                },
                new Algorithm
                {
                    Name = "insertion",
                    DisplayName = "Insertion Sort",
                    Description = "Algorytm buduje posortowaną część tablicy, wstawiając każdy kolejny element w odpowiednie miejsce.",
                    PseudoCode = "for i = 1 to n - 1\n  key = array[i]\n  j = i - 1\n  while j >= 0 and array[j] > key\n    array[j + 1] = array[j]\n    j = j - 1\n  array[j + 1] = key",
                    TimeComplexity = "O(n^2)",
                    SpaceComplexity = "O(1)",
                    IsVisible = true,
                    CategoryId = sorting.Id
                },
                new Algorithm
                {
                    Name = "merge",
                    DisplayName = "Merge Sort",
                    Description = "Algorytm rekurencyjny - dzieli tablicę na pół, sortuje każdą połowę osobno, a następnie scala posortowane części w jedną uporządkowaną tablicę.",
                    PseudoCode = "mergeSort(arr, left, right):\n  if left >= right\n    return\n  mid = (left + right) / 2\n  mergeSort(arr, left, mid)\n  mergeSort(arr, mid + 1, right)\n  merge(arr, left, mid, right)",
                    TimeComplexity = "O(n log n)",
                    SpaceComplexity = "O(n)",
                    IsVisible = true,
                    CategoryId = sorting.Id
                },
                new Algorithm
                {
                    Name = "binary-search",
                    DisplayName = "Binary Search",
                    Description = "Algorytm wyszukuje element w posortowanej tablicy, za każdym krokiem odrzucając połowę pozostałego zakresu.",
                    PseudoCode = "left = 0\nright = n - 1\nwhile left <= right\n  mid = (left + right) / 2\n  if array[mid] == target\n    return mid\n  if array[mid] < target\n    left = mid + 1\n  else\n    right = mid - 1\nreturn -1",
                    TimeComplexity = "O(log n)",
                    SpaceComplexity = "O(1)",
                    IsVisible = true,
                    CategoryId = searching.Id
                },
                new Algorithm
                {
                    Name = "bfs",
                    DisplayName = "Breadth-First Search",
                    Description = "Algorytm przeszukuje graf warstwami, odwiedzając najpierw wszystkich sąsiadów aktualnego wierzchołka.",
                    PseudoCode = "queue.enqueue(start)\nvisited.add(start)\nwhile queue is not empty\n  vertex = queue.dequeue()\n  for each neighbor of vertex\n    if neighbor not in visited\n      visited.add(neighbor)\n      queue.enqueue(neighbor)",
                    TimeComplexity = "O(V + E)",
                    SpaceComplexity = "O(V)",
                    IsVisible = true,
                    CategoryId = graphs.Id
                },
                new Algorithm
                {
                    Name = "dfs",
                    DisplayName = "Depth-First Search",
                    Description = "Algorytm przeszukuje graf w głąb, schodząc jak najdalej daną ścieżką przed powrotem do poprzednich wierzchołków.",
                    PseudoCode = "visit(vertex)\n  visited.add(vertex)\n  for each neighbor of vertex\n    if neighbor not in visited\n      visit(neighbor)",
                    TimeComplexity = "O(V + E)",
                    SpaceComplexity = "O(V)",
                    IsVisible = true,
                    CategoryId = graphs.Id
                });

            context.SaveChanges();
        }

        public static async Task SeedAdminAsync(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            const string adminRole = "Admin";
            const string adminEmail = "admin@local";
            const string adminPassword = "Admin123";

            if (!await roleManager.RoleExistsAsync(adminRole))
            {
                await roleManager.CreateAsync(new IdentityRole(adminRole));
            }

            var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
            if (existingAdmin != null) return;

            var adminUser = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, adminRole);
            }

        }
    }
}
