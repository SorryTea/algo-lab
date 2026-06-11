namespace algorithms_visualizer.Services.Models.Forum;

public class ForumPostDetailsDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string AuthorNickname { get; set; } = string.Empty;
    public string? AuthorAvatarPath { get; set; }
    public List<ForumCommentDto> Comments { get; set; } = [];
}

public class ForumCommentDto
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string AuthorNickname { get; set; } = string.Empty;
    public string? AuthorAvatarPath { get; set; }
}
