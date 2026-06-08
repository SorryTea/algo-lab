using algorithms_visualizer.Services.Models;

namespace algorithms_visualizer.Services.Graphs;

public class BfsService : IGraphAlgorithm
{
    public string Name => "bfs";

    public List<GraphAlgorithmStep> Execute(int[] vertices, int[][] edges, int startVertex)
    {
        var steps = new List<GraphAlgorithmStep>();
        var visited = new HashSet<int>();
        var queue = new Queue<int>();


        queue.Enqueue(startVertex);
        visited.Add(startVertex);

        steps.Add(new GraphAlgorithmStep
        {
            StepIndex = steps.Count,
            Vertices = vertices,
            Edges = edges,
            Visited = visited.ToArray(),
            Frontier = queue.ToArray(),
            Current = null,
            Description = $"Starting BFS from vertex {startVertex}"
        });

        while (queue.Count > 0)
        {
            int current = queue.Dequeue();


            steps.Add(new GraphAlgorithmStep
            {
                StepIndex = steps.Count,
                Vertices = vertices,
                Edges = edges,
                Visited = visited.ToArray(),
                Frontier = queue.ToArray(),
                Current = current,
                Description = $"Visiting vertex {current}"
            });

            foreach (var neighbor in GetNeighbors(current, edges))
            {
                if (!visited.Add(neighbor))
                {
                    continue;
                }

                queue.Enqueue(neighbor);

                steps.Add(new GraphAlgorithmStep
                {
                    StepIndex = steps.Count,
                    Vertices = vertices,
                    Edges = edges,
                    Visited = visited.ToArray(),
                    Frontier = queue.ToArray(),
                    Current = current,
                    Description = $"Adding neighbor {neighbor} to queue"
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
            Description = $"BFS complete. Visited {visited.Count} vertices."
        });

        return steps;
    }

    private static List<int> GetNeighbors(int vertex, int[][] edges)
    {
        var neighbors = new List<int>();
        foreach (var edge in edges)
        {
            if (edge[0] == vertex) neighbors.Add(edge[1]);
            else if (edge[1] == vertex) neighbors.Add(edge[0]);
        }
        return neighbors;
    }
}
