using Microsoft.EntityFrameworkCore;
using MyBlog.Api.Data;
using MyBlog.Api.DTOs.Article;

namespace MyBlog.Api.Services;

public class SearchService
{
    private readonly BlogDbContext _context;

    public SearchService(BlogDbContext context)
    {
        _context = context;
    }

    public async Task<List<ArticleListItemDto>> SearchAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new List<ArticleListItemDto>();
        }

        var lowerQuery = query.ToLowerInvariant();

        var articles = await _context.Articles
            .Include(a => a.Category)
            .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
            .Where(a => a.Title.ToLower().Contains(lowerQuery)
                     || (a.Summary != null && a.Summary.ToLower().Contains(lowerQuery))
                     || a.Content.ToLower().Contains(lowerQuery))
            .Take(50)
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

        return articles;
    }
}
