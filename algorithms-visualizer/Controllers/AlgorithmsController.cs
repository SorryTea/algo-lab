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
    private readonly IEnumerable<ISearchingAlgorithm> _searchingAlgorithms;
    private readonly IEnumerable<IGraphAlgorithm> _graphAlgorithms;

    public AlgorithmsController(
        AppDbContext context,
        IEnumerable<ISortingAlgorithm> algorithms,
        IEnumerable<ISearchingAlgorithm> searchingAlgorithms,
        IEnumerable<IGraphAlgorithm> graphAlgorithms)
    {
        _context = context;
        _algorithms = algorithms;
        _searchingAlgorithms = searchingAlgorithms;
        _graphAlgorithms = graphAlgorithms;
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
        var graphService = _graphAlgorithms.FirstOrDefault(a =>
            a.Name.Equals(request.AlgorithmName, StringComparison.OrdinalIgnoreCase));

        if (graphService != null)
        {
            if (request.Vertices == null || request.Vertices.Length == 0)
                return BadRequest("Vertices are required for graph algorithms");
            if (request.Edges == null)
                return BadRequest("Edges are required for graph algorithms");
            if (request.StartVertex == null)
                return BadRequest("Start vertex is required for graph algorithms");

            var stopwatch = Stopwatch.StartNew();
            var graphSteps = graphService.Execute(request.Vertices, request.Edges, request.StartVertex.Value);
            stopwatch.Stop();

            var graphLog = new ExecutionLog
            {
                AlgorithmName = request.AlgorithmName,
                InputSize = request.Vertices.Length,
                TotalSteps = graphSteps.Count,
                ExecutionTimeMs = stopwatch.ElapsedMilliseconds,
                RanAt = DateTime.UtcNow
            };
            _context.ExecutionLogs.Add(graphLog);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                steps = graphSteps,
                totalSteps = graphSteps.Count,
                executionTimeMs = stopwatch.ElapsedMilliseconds
            });
        }

        if (request.InputData == null || request.InputData.Length == 0)
            return BadRequest("Input data is required");

        var sortingService = _algorithms.FirstOrDefault(a =>
            a.Name.Equals(request.AlgorithmName, StringComparison.OrdinalIgnoreCase));
        var searchingService = _searchingAlgorithms.FirstOrDefault(a =>
            a.Name.Equals(request.AlgorithmName, StringComparison.OrdinalIgnoreCase));

        if (sortingService == null && searchingService == null)
            return NotFound("Algorithm not found");

        if (searchingService != null && request.Target == null)
            return BadRequest("Target value is required for searching algorithms");

        var sw = Stopwatch.StartNew();
        List<AlgorithmStep> steps;

        if (sortingService != null)
            steps = sortingService.Execute(request.InputData);
        else
            steps = searchingService!.Execute(request.InputData, request.Target!.Value);

        sw.Stop();

        var log = new ExecutionLog
        {
            AlgorithmName = request.AlgorithmName,
            InputSize = request.InputData.Length,
            TotalSteps = steps.Count,
            ExecutionTimeMs = sw.ElapsedMilliseconds,
            RanAt = DateTime.UtcNow
        };
        _context.ExecutionLogs.Add(log);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            steps,
            totalSteps = steps.Count,
            executionTimeMs = sw.ElapsedMilliseconds
        });
    }
}
