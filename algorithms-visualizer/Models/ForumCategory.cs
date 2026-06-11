using System.ComponentModel.DataAnnotations;

namespace algorithms_visualizer.Models;

public class ForumCategory
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Slug { get; set; } = string.Empty;

    public ICollection<ForumPost> Posts { get; set; } = [];
}
