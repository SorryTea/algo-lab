using algorithms_visualizer.Services.Models;

namespace algorithms_visualizer.Services.Graphs;

public class DfsService : IGraphAlgorithm
{
    public string Name => "dfs";

    public List<GraphAlgorithmStep> Execute(int[] vertices, int[][] edges, int startVertex)
    {
        var steps = new List<GraphAlgorithmStep>();
        var visited = new HashSet<int>();
        var stack = new Stack<int>();
        var adjacency = new Dictionary<int, List<int>>(vertices.Length);

        foreach (var vertex in vertices)
        {
            adjacency[vertex] = [];
        }

        foreach (var edge in edges)
        {
            if (!adjacency.TryGetValue(edge[0], out var fromNeighbors))
            {
                fromNeighbors = [];
                adjacency[edge[0]] = fromNeighbors;
            }

            if (!adjacency.TryGetValue(edge[1], out var toNeighbors))
            {
                toNeighbors = [];
                adjacency[edge[1]] = toNeighbors;
            }

            fromNeighbors.Add(edge[1]);
            toNeighbors.Add(edge[0]);
        }

        stack.Push(startVertex);

        steps.Add(new GraphAlgorithmStep
        {
            StepIndex = steps.Count,
            Vertices = vertices,
            Edges = edges,
            Visited = visited.ToArray(),
            Frontier = stack.ToArray(),
            Current = null,
            Description = $"Starting DFS from vertex {startVertex}"
        });

        // Build adjacency once so neighbor lookup stays O(1) per vertex instead of rescanning all edges.
        while (stack.Count > 0)
        {
            int current = stack.Pop();

            if (!visited.Add(current))
            {
                continue;
            }

            steps.Add(new GraphAlgorithmStep
            {
                StepIndex = steps.Count,
                Vertices = vertices,
                Edges = edges,
                Visited = visited.ToArray(),
                Frontier = stack.ToArray(),
                Current = current,
                Description = $"Visiting vertex {current}"
            });

            if (!adjacency.TryGetValue(current, out var neighbors))
            {
                continue;
            }

            foreach (var neighbor in neighbors)
            {
                if (visited.Contains(neighbor))
                {
                    continue;
                }

                stack.Push(neighbor);

                steps.Add(new GraphAlgorithmStep
                {
                    StepIndex = steps.Count,
                    Vertices = vertices,
                    Edges = edges,
                    Visited = visited.ToArray(),
                    Frontier = stack.ToArray(),
                    Current = current,
                    Description = $"Pushing neighbor {neighbor} to stack"
                });
            }
        }

        steps.Add(new GraphAlgorithmStep
        {
            StepIndex = steps.Count,
            Vertices = vertices,
            Edges = edges,
            Visited = visited.ToArray(),
            Frontier = [],
            Current = null,
            Description = $"DFS complete. Visited {visited.Count} vertices."
        });

        return steps;
    }
}
