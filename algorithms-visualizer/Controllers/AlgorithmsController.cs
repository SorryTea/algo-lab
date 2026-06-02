using System.Diagnostics;
using algorithms_visualizer.Data;
using algorithms_visualizer.Models;
using algorithms_visualizer.Services;
using algorithms_visualizer.Services.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace algorithms_visualizer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlgorithmsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEnumerable<ISortingAlgorithm> _algorithms;

    public AlgorithmsController(
        AppDbContext context,
        IEnumerable<ISortingAlgorithm> algorithms)
    {
        _context = context;
        _algorithms = algorithms;
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

    [HttpPost("execute")]
    public async Task<IActionResult> Execute([FromBody] ExecuteAlgorithmRequest request)
    {

        if (request.InputData == null || request.InputData.Length == 0)
            return BadRequest("Input data is required");

        var service = _algorithms.FirstOrDefault(a => a.Name.Equals(request.AlgorithmName, StringComparison.OrdinalIgnoreCase));

        if (service == null)
            return NotFound("Algorithm not found");

        var stopwatch = Stopwatch.StartNew();
        var steps = service.Execute(request.InputData);
        stopwatch.Stop();

        var log = new ExecutionLog
        {
            AlgorithmName = request.AlgorithmName,
            InputSize = request.InputData.Length,
            TotalSteps = steps.Count,
            ExecutionTimeMs = stopwatch.ElapsedMilliseconds,
            RanAt = DateTime.UtcNow
        };
        _context.ExecutionLogs.Add(log);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            steps,
            totalSteps = steps.Count,
            executionTimeMs = stopwatch.ElapsedMilliseconds
        });
    }
}
