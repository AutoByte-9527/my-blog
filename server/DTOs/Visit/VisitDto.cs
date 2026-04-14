using System.ComponentModel.DataAnnotations;

namespace MyBlog.Api.DTOs.Visit;

public class CreateVisitRequest
{
    [Required]
    public int ArticleId { get; set; }

    public string? Referer { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }
}

public class VisitStatsResponse
{
    public int Total { get; set; }
}
