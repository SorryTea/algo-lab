namespace algorithms_visualizer.Services.Models;

public class AlgorithmComparisonResult
{
    public string AlgorithmName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public int TotalSteps { get; set; }
    public long ExecutionTimeMs { get; set; }
    public long ExecutionTimeMicroseconds { get; set; }
    public string TimeComplexity { get; set; } = string.Empty;
    public string? Error { get; set; }
}
