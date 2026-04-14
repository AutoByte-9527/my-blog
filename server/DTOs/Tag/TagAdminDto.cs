using System.ComponentModel.DataAnnotations;

namespace MyBlog.Api.DTOs.Tag;

public class CreateTagRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Slug { get; set; }
}

public class UpdateTagRequest
{
    public string? Name { get; set; }
    public string? Slug { get; set; }
}
