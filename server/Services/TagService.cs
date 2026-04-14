using Microsoft.EntityFrameworkCore;
using MyBlog.Api.Data;
using MyBlog.Api.DTOs.Tag;
using MyBlog.Api.Entities;

namespace MyBlog.Api.Services;

public class TagService
{
    private readonly BlogDbContext _context;

    public TagService(BlogDbContext context)
    {
        _context = context;
    }

    public async Task<List<TagDto>> GetTagsAsync()
    {
        var tags = await _context.Tags
            .Include(t => t.ArticleTags)
            .Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug,
                ArticleCount = t.ArticleTags.Count
            })
            .ToListAsync();

        return tags;
    }
}

public class TagAdminService
{
    private readonly BlogDbContext _context;

    public TagAdminService(BlogDbContext context)
    {
        _context = context;
    }

    public async Task<List<TagDto>> GetTagsAsync()
    {
        var tags = await _context.Tags
            .Include(t => t.ArticleTags)
            .Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug,
                ArticleCount = t.ArticleTags.Count
            })
            .ToListAsync();

        return tags;
    }

    public async Task<Tag> CreateTagAsync(CreateTagRequest request)
    {
        var slug = request.Slug ?? GenerateSlug(request.Name);

        var tag = new Tag
        {
            Name = request.Name,
            Slug = slug
        };

        _context.Tags.Add(tag);
        await _context.SaveChangesAsync();

        return tag;
    }

    public async Task<Tag?> UpdateTagAsync(int id, UpdateTagRequest request)
    {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null) return null;

        if (!string.IsNullOrEmpty(request.Name))
            tag.Name = request.Name;
        if (!string.IsNullOrEmpty(request.Slug))
            tag.Slug = request.Slug;
        else if (!string.IsNullOrEmpty(request.Name))
            tag.Slug = GenerateSlug(request.Name);

        await _context.SaveChangesAsync();
        return tag;
    }

    public async Task<bool> DeleteTagAsync(int id)
    {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null) return false;

        _context.Tags.Remove(tag);
        await _context.SaveChangesAsync();
        return true;
    }

    private static string GenerateSlug(string name)
    {
        return name.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("--", "-");
    }
}
