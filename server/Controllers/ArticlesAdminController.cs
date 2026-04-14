using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Api.DTOs.Article;
using MyBlog.Api.Services;

namespace MyBlog.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/articles")]
public class ArticlesAdminController : ControllerBase
{
    private readonly ArticleAdminService _articleAdminService;

    public ArticlesAdminController(ArticleAdminService articleAdminService)
    {
        _articleAdminService = articleAdminService;
    }

    [HttpGet]
    public async Task<IActionResult> GetArticles(
        [FromQuery] int page = 1,
        [FromQuery] int page_size = 10,
        [FromQuery] string? category = null,
        [FromQuery] string? tag = null)
    {
        var result = await _articleAdminService.GetArticlesAsync(page, page_size, category, tag);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetArticleById(int id)
    {
        var article = await _articleAdminService.GetArticleByIdAsync(id);
        if (article == null)
        {
            return NotFound(new { message = "Article not found" });
        }
        return Ok(article);
    }

    [HttpPost]
    public async Task<IActionResult> CreateArticle([FromBody] CreateArticleRequest request)
    {
        if (string.IsNullOrEmpty(request.Slug) || string.IsNullOrEmpty(request.Title))
        {
            return BadRequest(new { message = "Slug and Title are required" });
        }

        var article = await _articleAdminService.CreateArticleAsync(request);
        return CreatedAtAction(nameof(GetArticleById), new { id = article.Id }, article);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateArticle(int id, [FromBody] UpdateArticleRequest request)
    {
        var article = await _articleAdminService.UpdateArticleAsync(id, request);
        if (article == null)
        {
            return NotFound(new { message = "Article not found" });
        }
        return Ok(article);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteArticle(int id)
    {
        var result = await _articleAdminService.DeleteArticleAsync(id);
        if (!result)
        {
            return NotFound(new { message = "Article not found" });
        }
        return NoContent();
    }
}
