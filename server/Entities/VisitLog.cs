using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Api.Entities;

[Table("visit_logs")]
public class VisitLog
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("article_id")]
    public int ArticleId { get; set; }

    [ForeignKey("ArticleId")]
    public Article Article { get; set; } = null!;

    [MaxLength(50)]
    [Column("ip")]
    public string? Ip { get; set; }

    [Required]
    [MaxLength(500)]
    [Column("user_agent")]
    public string UserAgent { get; set; } = string.Empty;

    [MaxLength(500)]
    [Column("referer")]
    public string? Referer { get; set; }

    [MaxLength(100)]
    [Column("country")]
    public string? Country { get; set; }

    [MaxLength(100)]
    [Column("city")]
    public string? City { get; set; }

    [MaxLength(50)]
    [Column("device")]
    public string? Device { get; set; }

    [MaxLength(100)]
    [Column("browser")]
    public string? Browser { get; set; }

    [MaxLength(100)]
    [Column("os")]
    public string? Os { get; set; }

    [Column("visited_at")]
    public DateTime VisitedAt { get; set; } = DateTime.UtcNow;
}
