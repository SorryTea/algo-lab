using System.ComponentModel.DataAnnotations;

namespace algorithms_visualizer.Models.Algorithms
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Slug { get; set; } = string.Empty;
    }
}
