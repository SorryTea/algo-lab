using algorithms_visualizer.Services.Models;

namespace algorithms_visualizer.Services.Sorting;

public class InsertionSortService : ISortingAlgorithm
{
    public string Name => "insertion";

    public List<AlgorithmStep> Execute(int[] input)
    {
        var arr = (int[])input.Clone();
        var steps = new List<AlgorithmStep>();
        var sorted = new List<int> { 0 };  // first element is considered sorted
        int n = arr.Length;

        steps.Add(new AlgorithmStep
        {
            StepIndex = steps.Count,
            Array = (int[])arr.Clone(),
            Comparing = [0],
            SortedIndices = sorted.ToArray(),
            Swapped = false,
            Description = $"Starting with first element as sorted"
        });

        for (int i = 1; i < n; i++)
        {
            int key = arr[i];

            steps.Add(new AlgorithmStep
            {
                StepIndex = steps.Count,
                Array = (int[])arr.Clone(),
                Comparing = [i],
                SortedIndices = sorted.ToArray(),
                Swapped = false,
                Description = $"Inserting element at index {i} (value: {key}) into sorted portion"
            });

            int j = i - 1;

            while (j >= 0 && arr[j] > key)
            {
                steps.Add(new AlgorithmStep
                {
                    StepIndex = steps.Count,
                    Array = (int[])arr.Clone(),
                    Comparing = [j, j + 1],
                    SortedIndices = sorted.ToArray(),
                    Swapped = false,
                    Description = $"Comparing key with element at index {j} (value: {arr[j]})"
                });

                arr[j + 1] = arr[j];

                steps.Add(new AlgorithmStep
                {
                    StepIndex = steps.Count,
                    Array = (int[])arr.Clone(),
                    Comparing = [j, j + 1],
                    SortedIndices = sorted.ToArray(),
                    Swapped = true,
                    Description = $"Moving element at index {j} to the right"
                });

                j--;
            }

            arr[j + 1] = key;

            steps.Add(new AlgorithmStep
            {
                StepIndex = steps.Count,
                Array = (int[])arr.Clone(),
                Comparing = [j + 1],
                SortedIndices = sorted.ToArray(),
                Swapped = false,
                Description = $"Inserted key at position {j + 1}"
            });

            sorted.Add(i);

            steps.Add(new AlgorithmStep
            {
                StepIndex = steps.Count,
                Array = (int[])arr.Clone(),
                Comparing = [],
                SortedIndices = sorted.ToArray(),
                Swapped = false,
                Description = $"Element at index {i} is now in the sorted portion"
            });
        }

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
