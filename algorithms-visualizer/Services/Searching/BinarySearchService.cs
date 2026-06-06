using algorithms_visualizer.Services.Models;

namespace algorithms_visualizer.Services.Searching;

public class BinarySearchService : ISearchingAlgorithm
{
    public string Name => "binary-search";

    public List<AlgorithmStep> Execute(int[] input, int target)
    {
        var arr = (int[])input.Clone();
        var steps = new List<AlgorithmStep>();
        int n = arr.Length;
        int left = 0;
        int right = n - 1;

        steps.Add(new AlgorithmStep
        {
            StepIndex = steps.Count,
            Array = (int[])arr.Clone(),
            Comparing = [left, right],
            SortedIndices = [],
            Swapped = false,
            Description = $"Starting binary search for {target} in range [{left}..{right}]"
        });

        while (left <= right)
        {
            int mid = left + ((right - left) / 2);
            int value = arr[mid];

            steps.Add(new AlgorithmStep
            {
                StepIndex = steps.Count,
                Array = (int[])arr.Clone(),
                Comparing = [mid],
                SortedIndices = [],
                Swapped = false,
                Description = $"Checking middle index {mid} (value: {value})"
            });

            if (value == target)
            {
                steps.Add(new AlgorithmStep
                {
                    StepIndex = steps.Count,
                    Array = (int[])arr.Clone(),
                    Comparing = [mid],
                    SortedIndices = [mid],
                    Swapped = false,
                    Description = $"Target {target} found at index {mid}"
                });

                return steps;
            }

            if (value < target)
            {
                left = mid + 1;
                steps.Add(new AlgorithmStep
                {
                    StepIndex = steps.Count,
                    Array = (int[])arr.Clone(),
                    Comparing = left <= right ? [left, right] : [],
                    SortedIndices = [],
                    Swapped = false,
                    Description = $"Eliminating left half; continuing in range [{left}..{right}]"
                });
            }
            else
            {
                right = mid - 1;
                steps.Add(new AlgorithmStep
                {
                    StepIndex = steps.Count,
                    Array = (int[])arr.Clone(),
                    Comparing = left <= right ? [left, right] : [],
                    SortedIndices = [],
                    Swapped = false,
                    Description = $"Eliminating right half; continuing in range [{left}..{right}]"
                });
            }
        }


        steps.Add(new AlgorithmStep
        {
            StepIndex = steps.Count,
            Array = (int[])arr.Clone(),
            Comparing = [],
            SortedIndices = [],
            Swapped = false,
            Description = $"Target {target} not found in the array"
        });

        return steps;
    }
}
