using System.ComponentModel.DataAnnotations;

namespace MyBlog.Api.DTOs.Article;

public class CreateArticleRequest
{
    [Required]
    public string Slug { get; set; } = string.Empty;

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public string? Summary { get; set; }

    public int? CategoryId { get; set; }

    public List<int>? TagIds { get; set; }
}

public class UpdateArticleRequest
{
    public string? Slug { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? Summary { get; set; }
    public int? CategoryId { get; set; }
    public List<int>? TagIds { get; set; }
}

public class ArticleAdminDto : ArticleListItemDto
{
    public string Content { get; set; } = string.Empty;
}

public class ArticleListResponse
{
    public List<ArticleListItemDto> Data { get; set; } = new();
    public int Total { get; set; }
}
