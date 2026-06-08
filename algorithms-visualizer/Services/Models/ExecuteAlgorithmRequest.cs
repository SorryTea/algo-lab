namespace algorithms_visualizer.Services.Models;

public class ExecuteAlgorithmRequest
{
    public string AlgorithmName { get; set; } = string.Empty;

    // sorting and searching algorithms
    public int[] InputData { get; set; } = [];

    // search algorithms
    public int? Target { get; set; }

    // graph algorithms
    public int[]? Vertices { get; set; }
    public int[][]? Edges { get; set; }
    public int? StartVertex { get; set; }
}
