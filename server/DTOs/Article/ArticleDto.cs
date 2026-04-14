namespace MyBlog.Api.DTOs.Article;

public class ArticleListItemDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public int ViewCount { get; set; }
    public string? CategoryName { get; set; }
    public string? CategorySlug { get; set; }
    public List<TagDto> Tags { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class ArticleDetailDto : ArticleListItemDto
{
    public string Content { get; set; } = string.Empty;
}

public class TagDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}
