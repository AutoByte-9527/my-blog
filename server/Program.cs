using System.Text;
using System.Text.Json;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyBlog.Api.Data;
using MyBlog.Api.Services;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Load environment variables
var adminUsername = Environment.GetEnvironmentVariable("ADMIN_USERNAME");
var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "default-secret-key-change-in-production";
var port = Environment.GetEnvironmentVariable("PORT") ?? "8000";

// Add configuration
builder.Configuration["Jwt:Secret"] = jwtSecret;

// Add DbContext with SQLite
builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseSqlite($"Data Source={Path.Combine(builder.Environment.ContentRootPath, "..", "blog.db")}"));

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "MyBlog",
            ValidAudience = "MyBlog",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

// Register services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ArticleService>();
builder.Services.AddScoped<ArticleAdminService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<CategoryAdminService>();
builder.Services.AddScoped<TagService>();
builder.Services.AddScoped<TagAdminService>();
builder.Services.AddScoped<VisitService>();
builder.Services.AddScoped<VisitAdminService>();
builder.Services.AddScoped<FileService>();
builder.Services.AddScoped<SearchService>();

// Add controllers with JSON options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // 全局限流已移除，改为按端点独立限流
    // 未标记 [EnableRateLimiting] 的端点不受限流影响

    // visit 策略：10请求/分钟（用于 VisitsController）
    options.AddPolicy("visit", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromSeconds(60)
            }));

    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsJsonAsync(new { message = "Too many requests" }, cancellationToken);
    };
});

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
    context.Database.EnsureCreated();

    // Create default admin user if not exists
    var authService = scope.ServiceProvider.GetRequiredService<AuthService>();
    await authService.EnsureAdminUserExistsAsync(adminUsername, adminPassword);
}

// Configure the HTTP request pipeline
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

// Serve static files
app.UseStaticFiles();

// Map controllers
app.MapControllers();

// Configure port
app.Urls.Clear();
app.Urls.Add($"http://0.0.0.0:{port}");

Console.WriteLine($"Server starting on http://0.0.0.0:{port}");

app.Run();
