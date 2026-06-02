using algorithms_visualizer.Services.Models;

namespace algorithms_visualizer.Services.Sorting;

public class MergeSortService : ISortingAlgorithm
{
    public string Name => "merge";

    public List<AlgorithmStep> Execute(int[] input)
    {
        var arr = (int[])input.Clone();
        var steps = new List<AlgorithmStep>();

        steps.Add(new AlgorithmStep
        {
            StepIndex = steps.Count,
            Array = (int[])arr.Clone(),
            Comparing = [],
            SortedIndices = [],
            Swapped = false,
            Description = $"Starting merge sort"
        });

        if (arr.Length > 0)
            MergeSort(arr, 0, arr.Length - 1, steps);

        steps.Add(new AlgorithmStep
        {
            StepIndex = steps.Count,
            Array = (int[])arr.Clone(),
            Comparing = [],
            SortedIndices = Enumerable.Range(0, arr.Length).ToArray(),
            Swapped = false,
            Description = $"Merge sort completed"
        });

        return steps;
    }

    private void MergeSort(int[] arr, int left, int right, List<AlgorithmStep> steps)
    {
        if (left == right)
        {
            steps.Add(new AlgorithmStep
            {
                StepIndex = steps.Count,
                Array = (int[])arr.Clone(),
                Comparing = [left],
                SortedIndices = [left],
                Swapped = false,
                Description = $"Single element at index {left} is already sorted"
            });

            return;
        }

        int mid = (left + right) / 2;

        steps.Add(new AlgorithmStep
        {
            StepIndex = steps.Count,
            Array = (int[])arr.Clone(),
            Comparing = [],
            SortedIndices = [],
            Swapped = false,
            Description = $"Dividing range [{left}..{right}] at midpoint {mid}"
        });

        MergeSort(arr, left, mid, steps);
        MergeSort(arr, mid + 1, right, steps);

        Merge(arr, left, mid, right, steps);
    }

    private void Merge(int[] arr, int left, int mid, int right, List<AlgorithmStep> steps)
    {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        int[] leftHalf = new int[n1];
        int[] rightHalf = new int[n2];
        int i, j;

        for (i = 0; i < n1; i++)
            leftHalf[i] = arr[left + i];
        for (j = 0; j < n2; j++)
            rightHalf[j] = arr[mid + 1 + j];

        steps.Add(new AlgorithmStep
        {
            StepIndex = steps.Count,
            Array = (int[])arr.Clone(),
            Comparing = [],
            SortedIndices = [],
            Swapped = false,
            Description = $"Merging ranges [{left}..{mid}] and [{mid + 1}..{right}]"
        });

        i = 0;
        j = 0;

        int writeIndex = left;
        while (i < n1 && j < n2)
        {
            int leftIndex = left + i;
            int rightIndex = mid + 1 + j;

            steps.Add(new AlgorithmStep
            {
                StepIndex = steps.Count,
                Array = (int[])arr.Clone(),
                Comparing = [leftIndex, rightIndex],
                SortedIndices = [],
                Swapped = false,
                Description = $"Comparing indices {leftIndex} and {rightIndex}"
            });

            if (leftHalf[i] <= rightHalf[j])
            {
                arr[writeIndex] = leftHalf[i];

                steps.Add(new AlgorithmStep
                {
                    StepIndex = steps.Count,
                    Array = (int[])arr.Clone(),
                    Comparing = [writeIndex],
                    SortedIndices = [],
                    Swapped = true,
                    Description = $"Placed value from index {leftIndex} at index {writeIndex}"
                });

                i++;
            }
            else
            {
                arr[writeIndex] = rightHalf[j];

                steps.Add(new AlgorithmStep
                {
                    StepIndex = steps.Count,
                    Array = (int[])arr.Clone(),
                    Comparing = [writeIndex],
                    SortedIndices = [],
                    Swapped = true,
                    Description = $"Placed value from index {rightIndex} at index {writeIndex}"
                });

                j++;
            }
            writeIndex++;
        }

        while (i < n1)
        {
            int leftIndex = left + i;
            arr[writeIndex] = leftHalf[i];

            steps.Add(new AlgorithmStep
            {
                StepIndex = steps.Count,
                Array = (int[])arr.Clone(),
                Comparing = [writeIndex],
                SortedIndices = [],
                Swapped = true,
                Description = $"Copying remaining value from index {leftIndex} to index {writeIndex}"
            });

            i++;
            writeIndex++;
        }

        while (j < n2)
        {
            int rightIndex = mid + 1 + j;
            arr[writeIndex] = rightHalf[j];

            steps.Add(new AlgorithmStep
            {
                StepIndex = steps.Count,
                Array = (int[])arr.Clone(),
                Comparing = [writeIndex],
                SortedIndices = [],
                Swapped = true,
                Description = $"Copying remaining value from index {rightIndex} to index {writeIndex}"
            });

            j++;
            writeIndex++;
        }

        steps.Add(new AlgorithmStep
        {
            StepIndex = steps.Count,
            Array = (int[])arr.Clone(),
            Comparing = [],
            SortedIndices = Enumerable.Range(left, right - left + 1).ToArray(),
            Swapped = false,
            Description = $"Range [{left}..{right}] is now sorted"
        });
    }
}
