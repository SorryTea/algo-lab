namespace algorithms_visualizer.Services.Models.Account;

public class CurrentUserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Nickname { get; set; }
    public string? AvatarPath { get; set; }
    public List<string> Roles { get; set; } = [];
}
