using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace algorithms_visualizer.Models.Users;

public class AppUser : IdentityUser
{
    [MaxLength(50)]
    public string? Nickname { get; set; }

    [MaxLength(200)]
    public string? AvatarPath { get; set; }
}
