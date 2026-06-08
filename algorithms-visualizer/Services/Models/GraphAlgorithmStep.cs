namespace algorithms_visualizer.Services.Models;

public class GraphAlgorithmStep
{
    public int StepIndex { get; set; }
    public int[] Vertices { get; set; } = [];
    public int[][] Edges { get; set; } = [];
    public int[] Visited { get; set; } = [];
    public int[] Frontier { get; set; } = [];
    public int? Current { get; set; }
    public string Description { get; set; } = string.Empty;
}
