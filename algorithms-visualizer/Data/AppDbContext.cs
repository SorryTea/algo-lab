using algorithms_visualizer.Models;
using Microsoft.EntityFrameworkCore;

namespace algorithms_visualizer.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Algorithm> Algorithms { get; set; }

        public DbSet<ExecutionLog> ExecutionLogs { get; set; }
    }
}
