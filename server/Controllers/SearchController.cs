using Microsoft.AspNetCore.Mvc;
using MyBlog.Api.Services;

namespace MyBlog.Api.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly SearchService _searchService;

    public SearchController(SearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return Ok(new List<object>());
        }

        var results = await _searchService.SearchAsync(q);
        return Ok(results);
    }
}
