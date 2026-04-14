using Microsoft.EntityFrameworkCore;
using MyBlog.Api.Data;
using MyBlog.Api.DTOs.Article;

namespace MyBlog.Api.Services;

public class ArticleService
{
    private readonly BlogDbContext _context;

    public ArticleService(BlogDbContext context)
    {
        _context = context;
    }

    public async Task<ArticleListResponse> GetArticlesAsync(string? category, string? tag, int page, int pageSize)
    {
        var query = _context.Articles
            .Include(a => a.Category)
            .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
            .AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(a => a.Category != null && a.Category.Slug == category);
        }

        if (!string.IsNullOrEmpty(tag))
        {
            query = query.Where(a => a.ArticleTags.Any(at => at.Tag.Slug == tag));
        }

        var total = await query.CountAsync();

        var articles = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new ArticleListItemDto
            {
                Id = a.Id,
                Slug = a.Slug,
                Title = a.Title,
                Summary = a.Summary,
                ViewCount = a.ViewCount,
                CategoryName = a.Category != null ? a.Category.Name : null,
                CategorySlug = a.Category != null ? a.Category.Slug : null,
                Tags = a.ArticleTags.Select(at => new TagDto
                {
                    Id = at.Tag.Id,
                    Name = at.Tag.Name,
                    Slug = at.Tag.Slug
                }).ToList(),
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();

        return new ArticleListResponse
        {
            Data = articles,
            Total = total
        };
    }

    public async Task<ArticleDetailDto?> GetArticleBySlugAsync(string slug)
    {
        var article = await _context.Articles
            .Include(a => a.Category)
            .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
            .FirstOrDefaultAsync(a => a.Slug == slug);

        if (article == null) return null;

        return new ArticleDetailDto
        {
            Id = article.Id,
            Slug = article.Slug,
            Title = article.Title,
            Content = article.Content,
            Summary = article.Summary,
            ViewCount = article.ViewCount,
            CategoryName = article.Category?.Name,
            CategorySlug = article.Category?.Slug,
            Tags = article.ArticleTags.Select(at => new TagDto
            {
                Id = at.Tag.Id,
                Name = at.Tag.Name,
                Slug = at.Tag.Slug
            }).ToList(),
            CreatedAt = article.CreatedAt
        };
    }
}
