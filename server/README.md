# MyBlog Backend

ASP.NET Core 10 Web API for personal blog.

## Tech Stack

- **Framework:** ASP.NET Core 10
- **ORM:** Entity Framework Core 10
- **Database:** SQLite
- **Auth:** JWT Bearer Token
- **Password:** BCrypt.Net-Next

## Project Structure

```
server/
├── MyBlog.sln           # Solution file
├── blog.db              # SQLite database
├── .env                 # Environment variables
└── src/
    └── MyBlog.Api/     # Main API project
        ├── Program.cs   # Entry point, DI, middleware
        ├── Controllers/ # API controllers (15 controllers)
        ├── Services/   # Business logic layer
        ├── Entities/    # Database entities
        ├── Data/       # EF Core DbContext
        ├── DTOs/       # Request/Response DTOs
        ├── Middleware/ # Rate limiting
        └── wwwroot/    # Static files (uploads)
```

## Quick Start

```bash
cd server/src
dotnet run
```

Server starts on `http://localhost:8000`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_USERNAME` | Initial admin username | - |
| `ADMIN_PASSWORD` | Initial admin password | - |
| `JWT_SECRET` | JWT signing secret | `default-secret-key-change-in-production` |
| `PORT` | Server port | `8000` |

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List articles |
| GET | `/api/articles/:slug` | Get article by slug |
| GET | `/api/categories` | List categories with article count |
| GET | `/api/tags` | List tags with article count |
| POST | `/api/visits` | Record visit |
| GET | `/api/visits/stats` | Get total visits |
| GET | `/api/search?q=` | Search articles |

### Admin (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/login` | Login |
| GET | `/api/admin/auth/me` | Get current user |
| GET | `/api/admin/articles` | List articles (paginated) |
| GET | `/api/admin/articles/:id` | Get article |
| POST | `/api/admin/articles` | Create article |
| PUT | `/api/admin/articles/:id` | Update article |
| DELETE | `/api/admin/articles/:id` | Delete article |
| GET | `/api/admin/categories` | List categories |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |
| GET | `/api/admin/tags` | List tags |
| POST | `/api/admin/tags` | Create tag |
| PUT | `/api/admin/tags/:id` | Update tag |
| DELETE | `/api/admin/tags/:id` | Delete tag |
| GET | `/api/admin/visits/stats` | Total visit count |
| GET | `/api/admin/visits/trend` | Visit trend |
| GET | `/api/admin/visits/top-articles` | Top articles |
| GET | `/api/admin/visits/geo` | Geographic distribution |
| GET | `/api/admin/visits/devices` | Device distribution |
| GET | `/api/admin/visits/browsers` | Browser distribution |
| GET | `/api/admin/visits/os` | OS distribution |
| GET | `/api/admin/visits/referers` | Referer distribution |
| POST | `/api/admin/upload/image` | Upload image |

## Build & Run

```bash
# Development
cd server/src
dotnet run

# Production build
dotnet build -c Release

# Run production
dotnet run --no-build -c Release
```

## Database

Uses existing SQLite database at `server/blog.db`.

Tables:
- `admin_users`
- `articles`
- `categories`
- `tags`
- `article_tags`
- `visit_logs`

EF Core automatically creates schema on first run if database doesn't exist.
