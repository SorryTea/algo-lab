using System.ComponentModel.DataAnnotations;

namespace algorithms_visualizer.Models
{
    public class ExecutionLog
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string AlgorithmName { get; set; } = string.Empty;

        public int InputSize { get; set; }

        public int TotalSteps { get; set; }

        public long ExecutionTimeMs { get; set; }

        public DateTime RanAt { get; set; } = DateTime.UtcNow;
    }
}
