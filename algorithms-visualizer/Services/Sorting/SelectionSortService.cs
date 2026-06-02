using algorithms_visualizer.Services.Models;

namespace algorithms_visualizer.Services.Sorting;

public class SelectionSortService : ISortingAlgorithm
{
    public string Name => "selection";

    public List<AlgorithmStep> Execute(int[] input)
    {
        var arr = (int[])input.Clone();
        var steps = new List<AlgorithmStep>();
        var sorted = new List<int>();
        int n = arr.Length;

        for (int i = 0; i < n - 1; i++)
        {
            int min_idx = i;
            steps.Add(new AlgorithmStep
            {
                StepIndex = steps.Count,
                Array = (int[])arr.Clone(),
                Comparing = [i],
                SortedIndices = sorted.ToArray(),
                Swapped = false,
                Description = $"Starting selection for index {i}"
            });

            for (int j = i + 1; j < n; j++)
            {
                steps.Add(new AlgorithmStep
                {
                    StepIndex = steps.Count,
                    Array = (int[])arr.Clone(),
                    Comparing = [min_idx, j],
                    SortedIndices = sorted.ToArray(),
                    Swapped = false,
                    Description = $"Comparing current minimum index {min_idx} with index {j}"
                });
                if (arr[j] < arr[min_idx])
                {
                    min_idx = j;
                    steps.Add(new AlgorithmStep
                    {
                        StepIndex = steps.Count,
                        Array = (int[])arr.Clone(),
                        Comparing = [min_idx],
                        SortedIndices = sorted.ToArray(),
                        Swapped = false,
                        Description = $"New minimum found at index {min_idx}"
                    });

                }
            }
            if (min_idx != i)
            {
                int temp = arr[i];
                arr[i] = arr[min_idx];
                arr[min_idx] = temp;

                steps.Add(new AlgorithmStep
                {
                    StepIndex = steps.Count,
                    Array = (int[])arr.Clone(),
                    Comparing = [i, min_idx],
                    SortedIndices = sorted.ToArray(),
                    Swapped = true,
                    Description = $"Swapped indices {i} and {min_idx}"
                });
            }

            sorted.Add(i);

            steps.Add(new AlgorithmStep
            {
                StepIndex = steps.Count,
                Array = (int[])arr.Clone(),
                Comparing = [],
                SortedIndices = sorted.ToArray(),
                Swapped = false,
                Description = $"Index {i} is now sorted"
            });

        }
        sorted.Add(n - 1);

        steps.Add(new AlgorithmStep
        {
            StepIndex = steps.Count,
            Array = (int[])arr.Clone(),
            Comparing = [],
            SortedIndices = sorted.ToArray(),
            Swapped = false,
            Description = $"All indices are now sorted"
        });

        return steps;
    }
}
