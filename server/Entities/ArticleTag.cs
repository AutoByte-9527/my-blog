using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Api.Entities;

[Table("article_tags")]
public class ArticleTag
{
    [Column("article_id")]
    public int ArticleId { get; set; }

    [ForeignKey("ArticleId")]
    public Article Article { get; set; } = null!;

    [Column("tag_id")]
    public int TagId { get; set; }

    [ForeignKey("TagId")]
    public Tag Tag { get; set; } = null!;
}
