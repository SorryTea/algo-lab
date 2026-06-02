namespace algorithms_visualizer.Services.Models
{
    public class AlgorithmStep
    {
        public int StepIndex { get; set; }
        public int[] Array { get; set; } = [];
        public int[] Comparing { get; set; } = [];
        public int[] SortedIndices { get; set; } = [];
        public bool Swapped { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
