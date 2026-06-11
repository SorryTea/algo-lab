using System.ComponentModel.DataAnnotations;

namespace algorithms_visualizer.Services.Models.Forum;

public class CreatePostRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Content { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }
}
