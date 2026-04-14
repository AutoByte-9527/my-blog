# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog monorepo with **Vite + React frontend** and **ASP.NET Core backend**. Articles are managed via Admin panel (stored in SQLite database).

## Architecture

```
my-blog/
├── web/                      # Vite 6 + React 19 - frontend
│   └── src/
│       ├── App.tsx           # App layout with Header/Footer
│       ├── routes.tsx        # React Router v7 routes
│       ├── pages/            # Page components
│       │   ├── home.tsx      # Home page
│       │   ├── archives.tsx  # Archives by year
│       │   ├── about.tsx     # About page
│       │   └── admin/        # Admin panel pages
│       ├── components/       # UI components (ArticleCard, CategoryBadge, etc.)
│       ├── lib/
│       │   ├── api.ts        # Public API client
│       │   ├── types.ts      # TypeScript types
│       │   └── admin-api.ts  # Admin API client (JWT)
│       └── stores/
│           └── admin-store.ts # Zustand auth state
├── server/                    # ASP.NET Core 10 - backend API
│   ├── MyBlog.sln
│   ├── MyBlog.Api.csproj
│   ├── Program.cs
│   ├── Controllers/          # API endpoints (Articles, Auth, Categories, Tags, Visits, Uploads, Search)
│   ├── Services/             # Business logic layer
│   ├── Entities/             # EF Core entities (AdminUser, Article, Category, Tag, ArticleTag, VisitLog)
│   ├── Data/                 # BlogDbContext
│   ├── DTOs/                 # Data transfer objects
│   ├── Middleware/           # Rate limiting
│   └── wwwroot/              # Static files (uploads)
└── blog.db                    # SQLite database (project root)
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vite 6 + React 19 + Tailwind CSS v4 + React Router v7 + SWR + Zustand |
| Backend | ASP.NET Core 10 + Entity Framework Core 10 + SQLite + JWT Bearer |

## Development Commands

**Frontend:**
```bash
cd web
pnpm dev        # Dev server on port 3000
pnpm build     # Production build
pnpm lint      # ESLint
```

**Backend:**
```bash
cd server
dotnet run     # Dev server on port 8000
dotnet build   # Build
```

## Admin System

Admin panel at `/admin/login` - credentials via environment variables.

**Setup:** Configure `server/.env`:
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
JWT_SECRET=your-secret-key
PORT=8000
```

Server auto-creates admin user on startup if not exists.

## API Routes

### Public
- `GET /api/articles` - List articles
- `GET /api/articles/:slug` - Article detail
- `GET /api/categories` - Categories with article count
- `GET /api/tags` - Tags with article count
- `POST /api/visits` - Record visit
- `GET /api/visits/stats` - Visit stats
- `GET /api/search?q=` - Search

### Admin (JWT Required)
- `POST /api/admin/auth/login` - Login
- `GET /api/admin/auth/me` - Current user
- `GET/POST/PUT/DELETE /api/admin/articles` - Article CRUD
- `GET/POST/PUT/DELETE /api/admin/categories` - Category CRUD
- `GET/POST/PUT/DELETE /api/admin/tags` - Tag CRUD
- `GET /api/admin/visits/*` - Visit statistics (stats, trend, geo, devices, browsers, os, referers)
- `POST /api/admin/upload/image` - Image upload

## Database

SQLite at `blog.db` (project root). Tables: `articles`, `categories`, `tags`, `article_tags`, `visit_logs`, `admin_users`.

**Entity Relationships:**
- Article N:1 Category
- Article N:M Tag (via article_tags)
- Article 1:N VisitLog

## Design System

- **Style:** Ink wash (水墨风格) - monochrome + warm accent
- **Fonts:** Ma Shan Zheng (titles), Noto Serif SC (body)
- **Colors:** Background #F5F5F0, Text #2D2D2D, Accent #8B4513

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ADMIN_USERNAME` | Initial admin username |
| `ADMIN_PASSWORD` | Initial admin password |
| `JWT_SECRET` | JWT signing secret |
| `PORT` | Server port (default 8000) |

## Notes

- API uses snake_case JSON naming for frontend compatibility
- Images uploaded via Admin stored in `wwwroot/uploads/`
- Visit tracking filters bots by user-agent pattern matching
- Rate limiting: 100 req/60s global, 10 req/60s for POST /api/visits
