namespace algorithms_visualizer.Services.Models.Forum;

public class ForumPostListItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;
    public string AuthorNickname { get; set; } = string.Empty;
    public string? AuthorAvatarPath { get; set; }
    public int CommentsCount { get; set; }
}
