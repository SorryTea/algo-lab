using algorithms_visualizer.Data;
using algorithms_visualizer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace algorithms_visualizer.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    private readonly AppDbContext _context;
    private readonly UserManager<AppUser> _userManager;

    public AdminController(AppDbContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IActionResult> Index()
    {
        ViewBag.AlgorithmsCount = await _context.Algorithms.CountAsync();
        ViewBag.CategoriesCount = await _context.Categories.CountAsync();
        ViewBag.ExecutionsCount = await _context.ExecutionLogs.CountAsync();

        return View();
    }

    [HttpGet]
    public async Task<IActionResult> Users()
    {
        var users = await _userManager.Users
            .OrderBy(user => user.Email)
            .ToListAsync();

        var model = new List<UserListItemViewModel>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);

            model.Add(new UserListItemViewModel
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Nickname = user.Nickname,
                AvatarPath = user.AvatarPath,
                Roles = roles.ToList(),
                IsBanned = user.LockoutEnd.HasValue && user.LockoutEnd > DateTimeOffset.UtcNow
            });
        }

        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> BanUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        if (id == _userManager.GetUserId(User))
        {
            TempData["Error"] = "Nie możesz zbanować samego siebie";
            return RedirectToAction(nameof(Users));
        }

        await _userManager.SetLockoutEnabledAsync(user, true);
        await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(100));
        TempData["Success"] = $"Użytkownik {user.Email} został zbanowany";

        return RedirectToAction(nameof(Users));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UnbanUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        await _userManager.SetLockoutEndDateAsync(user, null);
        TempData["Success"] = $"Użytkownik {user.Email} został odbanowany";

        return RedirectToAction(nameof(Users));
    }

    public async Task<IActionResult> Algorithms()
    {
        var algorithms = await _context.Algorithms
            .Include(a => a.Category)
            .OrderBy(a => a.Category!.Name)
            .ThenBy(a => a.DisplayName)
            .ToListAsync();

        return View(algorithms);
    }

    public async Task<IActionResult> EditAlgorithm(int id)
    {
        var algorithm = await _context.Algorithms.FindAsync(id);
        if (algorithm == null) return NotFound();

        ViewBag.Categories = await _context.Categories.ToListAsync();
        return View(algorithm);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditAlgorithm(int id, Algorithm model)
    {
        if (id != model.Id) return NotFound();

        if (!ModelState.IsValid)
        {
            ViewBag.Categories = await _context.Categories.ToListAsync();
            return View(model);
        }

        _context.Update(model);
        await _context.SaveChangesAsync();

        return RedirectToAction(nameof(Algorithms));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteAlgorithm(int id)
    {
        var algorithm = await _context.Algorithms.FindAsync(id);
        if (algorithm == null) return NotFound();

        _context.Algorithms.Remove(algorithm);
        await _context.SaveChangesAsync();

        return RedirectToAction(nameof(Algorithms));
    }
}
