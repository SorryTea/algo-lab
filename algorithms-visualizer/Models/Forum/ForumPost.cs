using algorithms_visualizer.Models.Users;
using System.ComponentModel.DataAnnotations;

namespace algorithms_visualizer.Models.Forum;

public class ForumPost
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int CategoryId { get; set; }
    public ForumCategory? Category { get; set; }

    public string AuthorId { get; set; } = string.Empty;
    public AppUser? Author { get; set; }

    public ICollection<ForumComment> Comments { get; set; } = [];
}
