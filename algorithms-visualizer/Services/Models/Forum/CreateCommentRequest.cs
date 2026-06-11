using System.ComponentModel.DataAnnotations;

namespace algorithms_visualizer.Services.Models.Forum;

public class CreateCommentRequest
{
    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;
}
