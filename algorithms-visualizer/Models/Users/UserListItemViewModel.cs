namespace algorithms_visualizer.Models.Users;

public class UserListItemViewModel
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Nickname { get; set; }
    public string? AvatarPath { get; set; }
    public List<string> Roles { get; set; } = [];
    public bool IsBanned { get; set; } = false;
}
