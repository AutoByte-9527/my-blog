using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MyBlog.Api.DTOs.Visit;
using MyBlog.Api.Services;

namespace MyBlog.Api.Controllers;

[ApiController]
public class VisitsController : ControllerBase
{
    private readonly VisitService _visitService;

    public VisitsController(VisitService visitService)
    {
        _visitService = visitService;
    }

    [HttpPost("api/visits")]
    [EnableRateLimiting("visit")]
    public async Task<IActionResult> CreateVisit([FromBody] CreateVisitRequest request)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();
        var referer = Request.Headers.Referer.ToString();

        var result = await _visitService.CreateVisitAsync(request, ip, userAgent, referer);

        if (!result)
        {
            return Ok(new { message = "Visit not recorded" });
        }

        return Ok(new { message = "Visit recorded" });
    }

    [HttpGet("api/visits/stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _visitService.GetTotalStatsAsync();
        return Ok(stats);
    }
}
