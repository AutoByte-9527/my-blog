using Microsoft.EntityFrameworkCore;
using MyBlog.Api.Data;

namespace MyBlog.Api.Services;

public class VisitAdminService
{
    private readonly BlogDbContext _context;

    public VisitAdminService(BlogDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.VisitLogs.CountAsync();
    }

    public async Task<List<TrendData>> GetTrendAsync(string period = "day")
    {
        var now = DateTime.UtcNow;
        DateTime startDate;

        switch (period.ToLower())
        {
            case "week":
                startDate = now.AddDays(-7);
                break;
            case "month":
                startDate = now.AddMonths(-1);
                break;
            case "day":
            default:
                startDate = now.AddDays(-1);
                break;
        }

        var visits = await _context.VisitLogs
            .Where(v => v.VisitedAt >= startDate)
            .ToListAsync();

        List<TrendData> result;
        if (period.ToLower() == "day")
        {
            result = visits
                .GroupBy(v => v.VisitedAt.ToString("yyyy-MM-dd HH:00"))
                .Select(g => new TrendData
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToList();
        }
        else
        {
            result = visits
                .GroupBy(v => v.VisitedAt.ToString("yyyy-MM-dd"))
                .Select(g => new TrendData
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToList();
        }

        return result;
    }

    public async Task<List<TopArticleData>> GetTopArticlesAsync(int top = 10)
    {
        var articles = await _context.Articles
            .OrderByDescending(a => a.ViewCount)
            .Take(top)
            .Select(a => new TopArticleData
            {
                Id = a.Id,
                Title = a.Title,
                Slug = a.Slug,
                ViewCount = a.ViewCount
            })
            .ToListAsync();

        return articles;
    }

    public async Task<List<GeoData>> GetGeoDistributionAsync()
    {
        var geoData = await _context.VisitLogs
            .Where(v => v.Country != null)
            .GroupBy(v => new { v.Country, v.City })
            .Select(g => new { Country = g.Key.Country, City = g.Key.City, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(50)
            .ToListAsync();

        return geoData.Select(g => new GeoData
        {
            Country = g.Country!,
            City = g.City,
            Count = g.Count
        }).ToList();
    }

    public async Task<List<DeviceData>> GetDeviceDistributionAsync()
    {
        var deviceData = await _context.VisitLogs
            .Where(v => v.Device != null)
            .GroupBy(v => v.Device)
            .Select(g => new { Device = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return deviceData.Select(d => new DeviceData
        {
            Device = d.Device!,
            Count = d.Count
        }).ToList();
    }

    public async Task<List<BrowserData>> GetBrowserDistributionAsync()
    {
        var browserData = await _context.VisitLogs
            .Where(v => v.Browser != null)
            .GroupBy(v => v.Browser)
            .Select(g => new { Browser = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return browserData.Select(b => new BrowserData
        {
            Browser = b.Browser!,
            Count = b.Count
        }).ToList();
    }

    public async Task<List<OsData>> GetOsDistributionAsync()
    {
        var osData = await _context.VisitLogs
            .Where(v => v.Os != null)
            .GroupBy(v => v.Os)
            .Select(g => new { Os = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return osData.Select(o => new OsData
        {
            Os = o.Os!,
            Count = o.Count
        }).ToList();
    }

    public async Task<List<RefererData>> GetRefererDistributionAsync()
    {
        var refererData = await _context.VisitLogs
            .Where(v => v.Referer != null)
            .GroupBy(v => v.Referer)
            .Select(g => new { Referer = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(50)
            .ToListAsync();

        return refererData.Select(r => new RefererData
        {
            Referer = r.Referer!,
            Count = r.Count
        }).ToList();
    }
}

// Response DTOs
public class TrendData
{
    public string Date { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class TopArticleData
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int ViewCount { get; set; }
}

public class GeoData
{
    public string Country { get; set; } = string.Empty;
    public string? City { get; set; }
    public int Count { get; set; }
}

public class DeviceData
{
    public string Device { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class BrowserData
{
    public string Browser { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class OsData
{
    public string Os { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class RefererData
{
    public string Referer { get; set; } = string.Empty;
    public int Count { get; set; }
}
