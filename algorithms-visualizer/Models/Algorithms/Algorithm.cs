using System.ComponentModel.DataAnnotations;

namespace algorithms_visualizer.Models.Algorithms
{
    public class Algorithm
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string DisplayName { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string PseudoCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string TimeComplexity { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string SpaceComplexity { get; set; } = string.Empty;

        public bool IsVisible { get; set; } = true;

        public int CategoryId { get; set; }

        public Category? Category { get; set; }
    }
}
