using algorithms_visualizer.Services.Models;

namespace algorithms_visualizer.Services.Sorting;

public class BubbleSortService : ISortingAlgorithm
{
    public string Name => "bubble";

    public List<AlgorithmStep> Execute(int[] input)
    {
        var arr = (int[])input.Clone();
        var steps = new List<AlgorithmStep>();
        var sorted = new List<int>();
        int n = arr.Length;

        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n - i - 1; j++)
            {
                steps.Add(new AlgorithmStep
                {
                    StepIndex = steps.Count,
                    Array = (int[])arr.Clone(),
                    Comparing = [j, j + 1],
                    SortedIndices = sorted.ToArray(),
                    Swapped = false,
                    Description = $"Comparing indices {j} and {j + 1}"
                });

                if (arr[j] > arr[j + 1])
                {
                    // Swap (arr[j], arr[j + 1]) = (arr[j + 1], arr[j])
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;

                    steps.Add(new AlgorithmStep
                    {
                        StepIndex = steps.Count,
                        Array = (int[])arr.Clone(),
                        Comparing = [j, j + 1],
                        SortedIndices = sorted.ToArray(),
                        Swapped = true,
                        Description = $"Swapped indices {j} and {j + 1}"
                    });

                }
            }

            sorted.Add(n - 1 - i);

            steps.Add(new AlgorithmStep
            {
                StepIndex = steps.Count,
                Array = (int[])arr.Clone(),
                Comparing = [],
                SortedIndices = sorted.ToArray(),
                Swapped = false,
                Description = $"Element at index {n - 1 - i} is now in correct position"
            });

        }

        steps.Add(new AlgorithmStep
        {
            StepIndex = steps.Count,
            Array = (int[])arr.Clone(),
            Comparing = [],
            SortedIndices = sorted.ToArray(),
            Swapped = false,
            Description = $"Sorting complete"
        });

        return steps;
    }
}
