using Microsoft.AspNetCore.Mvc;
using MyBlog.Api.DTOs.Article;
using MyBlog.Api.Services;

namespace MyBlog.Api.Controllers;

[ApiController]
[Route("api/articles")]
public class ArticlesController : ControllerBase
{
    private readonly ArticleService _articleService;

    public ArticlesController(ArticleService articleService)
    {
        _articleService = articleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetArticles(
        [FromQuery] string? category = null,
        [FromQuery] string? tag = null,
        [FromQuery] int page = 1,
        [FromQuery] int page_size = 10)
    {
        var result = await _articleService.GetArticlesAsync(category, tag, page, page_size);
        return Ok(result.Data);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetArticleBySlug(string slug)
    {
        var article = await _articleService.GetArticleBySlugAsync(slug);
        if (article == null)
        {
            return NotFound(new { message = "Article not found" });
        }
        return Ok(article);
    }
}
