using algorithms_visualizer.Data;
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
}
