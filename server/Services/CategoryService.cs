using Microsoft.EntityFrameworkCore;
using MyBlog.Api.Data;
using MyBlog.Api.DTOs.Category;
using MyBlog.Api.Entities;

namespace MyBlog.Api.Services;

public class CategoryService
{
    private readonly BlogDbContext _context;

    public CategoryService(BlogDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> GetCategoriesAsync()
    {
        var categories = await _context.Categories
            .Include(c => c.Articles)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                ArticleCount = c.Articles.Count
            })
            .ToListAsync();

        return categories;
    }
}

public class CategoryAdminService
{
    private readonly BlogDbContext _context;

    public CategoryAdminService(BlogDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> GetCategoriesAsync()
    {
        var categories = await _context.Categories
            .Include(c => c.Articles)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                ArticleCount = c.Articles.Count
            })
            .ToListAsync();

        return categories;
    }

    public async Task<Category> CreateCategoryAsync(CreateCategoryRequest request)
    {
        var slug = request.Slug ?? GenerateSlug(request.Name);

        var category = new Category
        {
            Name = request.Name,
            Slug = slug
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return category;
    }

    public async Task<Category?> UpdateCategoryAsync(int id, UpdateCategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return null;

        if (!string.IsNullOrEmpty(request.Name))
            category.Name = request.Name;
        if (!string.IsNullOrEmpty(request.Slug))
            category.Slug = request.Slug;
        else if (!string.IsNullOrEmpty(request.Name))
            category.Slug = GenerateSlug(request.Name);

        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<bool> DeleteCategoryAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return false;

        _context.Categories.Remove(category);
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
