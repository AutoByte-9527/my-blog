namespace MyBlog.Api.DTOs.Tag;

public class TagDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int ArticleCount { get; set; }
}
