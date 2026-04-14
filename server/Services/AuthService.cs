using Microsoft.EntityFrameworkCore;
using MyBlog.Api.Data;
using MyBlog.Api.DTOs.Auth;
using MyBlog.Api.Entities;

namespace MyBlog.Api.Services;

public class AuthService
{
    private readonly BlogDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthService(BlogDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _context.AdminUsers
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
        {
            return null;
        }

        var token = _jwtService.GenerateToken(user.Id, user.Username);

        return new LoginResponse
        {
            AccessToken = token,
            User = new UserInfo
            {
                Id = user.Id,
                Username = user.Username,
                Nickname = user.Nickname
            }
        };
    }

    public async Task<UserInfo?> GetUserByIdAsync(int id)
    {
        var user = await _context.AdminUsers.FindAsync(id);
        if (user == null) return null;

        return new UserInfo
        {
            Id = user.Id,
            Username = user.Username,
            Nickname = user.Nickname
        };
    }

    public async Task EnsureAdminUserExistsAsync(string? username, string? password)
    {
        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            return;

        var exists = await _context.AdminUsers.AnyAsync(u => u.Username == username);
        if (!exists)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            var adminUser = new AdminUser
            {
                Username = username,
                Password = hashedPassword,
                CreatedAt = DateTime.UtcNow
            };
            _context.AdminUsers.Add(adminUser);
            await _context.SaveChangesAsync();
        }
    }
}
