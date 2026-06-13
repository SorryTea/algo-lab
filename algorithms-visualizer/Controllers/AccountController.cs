using algorithms_visualizer.Models.Users;
using algorithms_visualizer.Services.Models.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace algorithms_visualizer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;

    public AccountController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing != null) return BadRequest("Email is already taken");

        var user = new AppUser
        {
            UserName = request.Email,
            Email = request.Email,
            Nickname = request.Nickname,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(e => e.Description));
        }

        await _signInManager.SignInAsync(user, isPersistent: false);
        return Ok(new { id = user.Id, email = user.Email });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _signInManager.PasswordSignInAsync(
            request.Email,
            request.Password,
            isPersistent: request.RememberMe,
            lockoutOnFailure: false);

        if (result.IsLockedOut) return BadRequest("Account is locked");
        if (!result.Succeeded) return BadRequest("Invalid email or password");

        var user = await _userManager.FindByEmailAsync(request.Email);
        return Ok(new { id = user!.Id, email = user.Email });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        if (!User.Identity?.IsAuthenticated ?? true)
        {
            return Ok(new { isAuthenticated = false });
        }

        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Ok(new { isAuthenticated = false });

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            isAuthenticated = true,
            user = new CurrentUserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Nickname = user.Nickname,
                AvatarPath = user.AvatarPath,
                Roles = roles.ToList()
            }
        });
    }
}
