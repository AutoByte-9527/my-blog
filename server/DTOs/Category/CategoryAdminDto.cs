using System.ComponentModel.DataAnnotations;

namespace MyBlog.Api.DTOs.Category;

public class CreateCategoryRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Slug { get; set; }
}

public class UpdateCategoryRequest
{
    public string? Name { get; set; }
    public string? Slug { get; set; }
}
