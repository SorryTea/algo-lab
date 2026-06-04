using algorithms_visualizer.Data;
using algorithms_visualizer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace algorithms_visualizer.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        ViewBag.AlgorithmsCount = await _context.Algorithms.CountAsync();
        ViewBag.CategoriesCount = await _context.Categories.CountAsync();
        ViewBag.ExecutionsCount = await _context.ExecutionLogs.CountAsync();

        return View();
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
