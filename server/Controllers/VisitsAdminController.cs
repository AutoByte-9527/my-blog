using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Api.Services;

namespace MyBlog.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/visits")]
public class VisitsAdminController : ControllerBase
{
    private readonly VisitAdminService _visitAdminService;

    public VisitsAdminController(VisitAdminService visitAdminService)
    {
        _visitAdminService = visitAdminService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var total = await _visitAdminService.GetTotalCountAsync();
        return Ok(new { total });
    }

    [HttpGet("trend")]
    public async Task<IActionResult> GetTrend([FromQuery] string period = "day")
    {
        var trend = await _visitAdminService.GetTrendAsync(period);
        return Ok(trend);
    }

    [HttpGet("top-articles")]
    public async Task<IActionResult> GetTopArticles([FromQuery] int top = 10)
    {
        var articles = await _visitAdminService.GetTopArticlesAsync(top);
        return Ok(articles);
    }

    [HttpGet("geo")]
    public async Task<IActionResult> GetGeoDistribution()
    {
        var geo = await _visitAdminService.GetGeoDistributionAsync();
        return Ok(geo);
    }

    [HttpGet("devices")]
    public async Task<IActionResult> GetDeviceDistribution()
    {
        var devices = await _visitAdminService.GetDeviceDistributionAsync();
        return Ok(devices);
    }

    [HttpGet("browsers")]
    public async Task<IActionResult> GetBrowserDistribution()
    {
        var browsers = await _visitAdminService.GetBrowserDistributionAsync();
        return Ok(browsers);
    }

    [HttpGet("os")]
    public async Task<IActionResult> GetOsDistribution()
    {
        var os = await _visitAdminService.GetOsDistributionAsync();
        return Ok(os);
    }

    [HttpGet("referers")]
    public async Task<IActionResult> GetRefererDistribution()
    {
        var referers = await _visitAdminService.GetRefererDistributionAsync();
        return Ok(referers);
    }
}
