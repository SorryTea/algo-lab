using algorithms_visualizer.Models.Users;
using System.ComponentModel.DataAnnotations;

namespace algorithms_visualizer.Models.Forum;

public class ForumComment
{
    public int Id { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int PostId { get; set; }
    public ForumPost? Post { get; set; }

    public string AuthorId { get; set; } = string.Empty;
    public AppUser? Author { get; set; }
}
