using Microsoft.EntityFrameworkCore;
using MyBlog.Api.Data;
using MyBlog.Api.DTOs.Article;
using MyBlog.Api.Entities;

namespace MyBlog.Api.Services;

public class ArticleAdminService
{
    private readonly BlogDbContext _context;

    public ArticleAdminService(BlogDbContext context)
    {
        _context = context;
    }

    public async Task<ArticleListResponse> GetArticlesAsync(int page, int pageSize, string? category, string? tag)
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

    public async Task<ArticleAdminDto?> GetArticleByIdAsync(int id)
    {
        var article = await _context.Articles
            .Include(a => a.Category)
            .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (article == null) return null;

        return new ArticleAdminDto
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

    public async Task<Article> CreateArticleAsync(CreateArticleRequest request)
    {
        var article = new Article
        {
            Slug = request.Slug,
            Title = request.Title,
            Content = request.Content,
            Summary = request.Summary,
            CategoryId = request.CategoryId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Articles.Add(article);
        await _context.SaveChangesAsync();

        if (request.TagIds != null && request.TagIds.Count > 0)
        {
            foreach (var tagId in request.TagIds)
            {
                _context.ArticleTags.Add(new ArticleTag
                {
                    ArticleId = article.Id,
                    TagId = tagId
                });
            }
            await _context.SaveChangesAsync();
        }

        return article;
    }

    public async Task<Article?> UpdateArticleAsync(int id, UpdateArticleRequest request)
    {
        var article = await _context.Articles
            .Include(a => a.ArticleTags)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (article == null) return null;

        if (!string.IsNullOrEmpty(request.Slug))
            article.Slug = request.Slug;
        if (!string.IsNullOrEmpty(request.Title))
            article.Title = request.Title;
        if (!string.IsNullOrEmpty(request.Content))
            article.Content = request.Content;
        if (request.Summary != null)
            article.Summary = request.Summary;
        if (request.CategoryId.HasValue)
            article.CategoryId = request.CategoryId;

        article.UpdatedAt = DateTime.UtcNow;

        if (request.TagIds != null)
        {
            // Remove existing tags
            _context.ArticleTags.RemoveRange(article.ArticleTags);

            // Add new tags
            foreach (var tagId in request.TagIds)
            {
                _context.ArticleTags.Add(new ArticleTag
                {
                    ArticleId = article.Id,
                    TagId = tagId
                });
            }
        }

        await _context.SaveChangesAsync();
        return article;
    }

    public async Task<bool> DeleteArticleAsync(int id)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null) return false;

        _context.Articles.Remove(article);
        await _context.SaveChangesAsync();
        return true;
    }
}
