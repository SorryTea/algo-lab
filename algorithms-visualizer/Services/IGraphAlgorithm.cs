using algorithms_visualizer.Services.Models;

namespace algorithms_visualizer.Services;

public interface IGraphAlgorithm
{
    string Name { get; }
    List<GraphAlgorithmStep> Execute(int[] vertices, int[][] edges, int startVertex);
}
