namespace algorithms_visualizer.Services.Models;

public class ExecuteAlgorithmRequest
{
    public string AlgorithmName { get; set; } = string.Empty;
    public int[] InputData { get; set; } = [];
    public int? Target { get; set; }
}
