using Microsoft.EntityFrameworkCore;
using MyBlog.Api.Data;
using MyBlog.Api.DTOs.Visit;
using MyBlog.Api.Entities;

namespace MyBlog.Api.Services;

public class VisitService
{
    private readonly BlogDbContext _context;

    private static readonly string[] BotPatterns =
    {
        "python", "requests", "curl", "wget", "scrapy", "bot", "crawl", "spider",
        "googlebot", "bingbot", "yandexbot", "baiduspider", "facebookexternalhit",
        "twitterbot", "linkedinbot", "slackbot"
    };

    public VisitService(BlogDbContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateVisitAsync(CreateVisitRequest request, string? ip, string userAgent, string? referer)
    {
        // Filter bots
        var lowerUserAgent = userAgent.ToLowerInvariant();
        if (BotPatterns.Any(pattern => lowerUserAgent.Contains(pattern)))
        {
            return false;
        }

        // Parse user agent
        var (device, browser, os) = ParseUserAgent(userAgent);

        var visitLog = new VisitLog
        {
            ArticleId = request.ArticleId,
            Ip = ip,
            UserAgent = userAgent,
            Referer = referer,
            Country = request.Country,
            City = request.City,
            Device = device,
            Browser = browser,
            Os = os,
            VisitedAt = DateTime.UtcNow
        };

        _context.VisitLogs.Add(visitLog);

        // Check if article exists first
        var article = await _context.Articles.FindAsync(request.ArticleId);
        if (article == null)
        {
            // Article not found, skip recording
            return false;
        }

        // Increment view count
        article.ViewCount++;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<VisitStatsResponse> GetTotalStatsAsync()
    {
        var total = await _context.VisitLogs.CountAsync();
        return new VisitStatsResponse { Total = total };
    }

    private static (string? device, string? browser, string? os) ParseUserAgent(string userAgent)
    {
        var device = "PC";
        var browser = "Unknown";
        var os = "Unknown";

        var lower = userAgent.ToLowerInvariant();

        // Detect device
        if (lower.Contains("mobile") || lower.Contains("android") || lower.Contains("iphone"))
        {
            device = "Mobile";
        }
        else if (lower.Contains("tablet") || lower.Contains("ipad"))
        {
            device = "Tablet";
        }
        else if (lower.Contains("bot") || lower.Contains("crawl") || lower.Contains("spider"))
        {
            device = "Bot";
        }

        // Detect browser
        if (lower.Contains("chrome") && !lower.Contains("edg"))
        {
            browser = "Chrome";
        }
        else if (lower.Contains("safari") && !lower.Contains("chrome"))
        {
            browser = "Safari";
        }
        else if (lower.Contains("firefox"))
        {
            browser = "Firefox";
        }
        else if (lower.Contains("edg"))
        {
            browser = "Edge";
        }

        // Detect OS
        if (lower.Contains("windows"))
        {
            os = "Windows";
        }
        else if (lower.Contains("mac os") || lower.Contains("macos"))
        {
            os = "macOS";
        }
        else if (lower.Contains("linux") && !lower.Contains("android"))
        {
            os = "Linux";
        }
        else if (lower.Contains("android"))
        {
            os = "Android";
        }
        else if (lower.Contains("ios") || lower.Contains("iphone") || lower.Contains("ipad"))
        {
            os = "iOS";
        }

        return (device, browser, os);
    }
}
