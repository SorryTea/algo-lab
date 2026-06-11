using algorithms_visualizer.Models.Algorithms;
using algorithms_visualizer.Models.Forum;
using algorithms_visualizer.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace algorithms_visualizer.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Algorithm> Algorithms { get; set; }
        public DbSet<ExecutionLog> ExecutionLogs { get; set; }

        public DbSet<ForumCategory> ForumCategories { get; set; }
        public DbSet<ForumPost> ForumPosts { get; set; }
        public DbSet<ForumComment> ForumComments { get; set; }
    }
}
