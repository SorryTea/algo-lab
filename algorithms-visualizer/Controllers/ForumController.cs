using algorithms_visualizer.Data;
using algorithms_visualizer.Models.Forum;
using algorithms_visualizer.Models.Users;
using algorithms_visualizer.Services.Models.Forum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace algorithms_visualizer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ForumController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<AppUser> _userManager;

    public ForumController(AppDbContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET /api/forum/categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.ForumCategories
            .AsNoTracking()
            .OrderBy(category => category.Name)
            .Select(category => new
            {
                category.Id,
                category.Name,
                category.Slug
            })
            .ToListAsync();

        return Ok(categories);
    }

    // GET /api/forum/posts?categorySlug=general
    [HttpGet("posts")]
    public async Task<IActionResult> GetPosts([FromQuery] string? categorySlug = null)
    {
        var query = _context.ForumPosts
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(categorySlug))
        {
            query = query.Where(post => post.Category!.Slug == categorySlug);
        }

        var postRows = await query
            .OrderByDescending(post => post.CreatedAt)
            .Select(post => new
            {
                post.Id,
                post.Title,
                post.CreatedAt,
                CategoryName = post.Category!.Name,
                CategorySlug = post.Category.Slug,
                AuthorNickname = post.Author!.Nickname,
                AuthorEmail = post.Author.Email,
                AuthorAvatarPath = post.Author.AvatarPath,
                CommentsCount = post.Comments.Count
            })
            .ToListAsync();

        var posts = postRows
            .Select(post => new ForumPostListItemDto
            {
                Id = post.Id,
                Title = post.Title,
                CreatedAt = post.CreatedAt,
                CategoryName = post.CategoryName,
                CategorySlug = post.CategorySlug,
                AuthorNickname = GetAuthorDisplayName(post.AuthorNickname, post.AuthorEmail),
                AuthorAvatarPath = post.AuthorAvatarPath,
                CommentsCount = post.CommentsCount
            })
            .ToList();

        return Ok(posts);
    }

    // GET /api/forum/posts/{id}
    [HttpGet("posts/{id}")]
    public async Task<IActionResult> GetPost(int id)
    {
        var post = await _context.ForumPosts
            .AsNoTracking()
            .Include(post => post.Category)
            .Include(post => post.Author)
            .Include(post => post.Comments)
                .ThenInclude(comment => comment.Author)
            .FirstOrDefaultAsync(post => post.Id == id);

        if (post == null)
        {
            return NotFound();
        }

        var dto = new ForumPostDetailsDto
        {
            Id = post.Id,
            Title = post.Title,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            CategoryName = post.Category!.Name,
            AuthorNickname = GetAuthorDisplayName(post.Author),
            AuthorAvatarPath = post.Author?.AvatarPath,
            Comments = post.Comments
                .OrderBy(comment => comment.CreatedAt)
                .Select(comment => new ForumCommentDto
                {
                    Id = comment.Id,
                    Content = comment.Content,
                    CreatedAt = comment.CreatedAt,
                    AuthorNickname = GetAuthorDisplayName(comment.Author),
                    AuthorAvatarPath = comment.Author?.AvatarPath
                })
                .ToList()
        };

        return Ok(dto);
    }

    // POST /api/forum/posts
    [HttpPost("posts")]
    [Authorize]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        var categoryExists = await _context.ForumCategories
            .AnyAsync(category => category.Id == request.CategoryId);
        if (!categoryExists)
        {
            return BadRequest("Category not found");
        }

        var post = new ForumPost
        {
            Title = request.Title,
            Content = request.Content,
            CategoryId = request.CategoryId,
            AuthorId = user.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.ForumPosts.Add(post);
        await _context.SaveChangesAsync();

        return Ok(new { id = post.Id });
    }

    // POST /api/forum/posts/{id}/comments
    [HttpPost("posts/{id}/comments")]
    [Authorize]
    public async Task<IActionResult> CreateComment(int id, [FromBody] CreateCommentRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        var postExists = await _context.ForumPosts.AnyAsync(post => post.Id == id);
        if (!postExists)
        {
            return NotFound("Post not found");
        }

        var comment = new ForumComment
        {
            Content = request.Content,
            PostId = id,
            AuthorId = user.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.ForumComments.Add(comment);
        await _context.SaveChangesAsync();

        return Ok(new { id = comment.Id });
    }

    // DELETE /api/forum/posts/{id} - tylko admin lub autor
    [HttpDelete("posts/{id}")]
    [Authorize]
    public async Task<IActionResult> DeletePost(int id)
    {
        var post = await _context.ForumPosts.FindAsync(id);
        if (post == null)
        {
            return NotFound();
        }

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
        var isAuthor = post.AuthorId == user.Id;

        if (!isAdmin && !isAuthor)
        {
            return Forbid();
        }

        _context.ForumPosts.Remove(post);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static string GetAuthorDisplayName(AppUser? author)
    {
        return GetAuthorDisplayName(author?.Nickname, author?.Email);
    }

    private static string GetAuthorDisplayName(string? nickname, string? email)
    {
        if (!string.IsNullOrWhiteSpace(nickname))
        {
            return nickname;
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            return string.Empty;
        }

        var atIndex = email.IndexOf('@');
        return atIndex > 0 ? email[..atIndex] : email;
    }
}
