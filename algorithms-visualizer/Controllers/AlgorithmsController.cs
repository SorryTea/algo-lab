using algorithms_visualizer.Data;
using algorithms_visualizer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace algorithms_visualizer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlgorithmsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AlgorithmsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var algorithms = await _context.Algorithms
            .Where(algorithm => algorithm.IsVisible)
            .Include(algorithm => algorithm.Category)
            .ToListAsync();

        return Ok(algorithms);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var algorithm = await _context.Algorithms
            .Include(algorithm => algorithm.Category)
            .FirstOrDefaultAsync(algorithm => algorithm.Id == id);

        if (algorithm == null)
            return NotFound();

        return Ok(algorithm);
    }
}
