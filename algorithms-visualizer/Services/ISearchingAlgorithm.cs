using algorithms_visualizer.Services.Models;

namespace algorithms_visualizer.Services;

public interface ISearchingAlgorithm
{
    string Name { get; }
    List<AlgorithmStep> Execute(int[] input, int target);
}
