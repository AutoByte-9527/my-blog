# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog monorepo with **Vite + React frontend** and **NestJS backend**. Articles are managed via Admin panel (stored in SQLite database).

## Architecture

```
my-blog/
├── web/                      # Vite 6 + React 19 - frontend
│   └── src/
│       ├── main.tsx         # Entry point
│       ├── App.tsx          # AppLayout with Header/Footer
│       ├── routes.tsx       # React Router v7 routes
│       ├── pages/           # Page components
│       │   └── admin/      # Admin panel pages
│       ├── components/      # UI components
│       │   └── admin/      # Admin components (Layout, Sidebar, Charts, Editor)
│       ├── lib/api.ts       # Public API client
│       ├── lib/admin-api.ts # Admin API client
│       └── stores/          # Zustand state
│           └── admin-store.ts # Admin auth state
├── server/                   # NestJS 11 - backend API
│   └── src/
│       ├── main.ts          # Bootstrap
│       ├── app.module.ts    # Root module (ConfigModule global)
│       ├── auth/            # JWT auth module
│       ├── upload/          # File upload module
│       ├── article/         # Article module (public + admin controllers)
│       ├── category/        # Category module (public + admin controllers)
│       ├── tag/             # Tag module (public + admin controllers)
│       ├── visit/          # Visit tracking module (public + admin controllers)
│       └── markdown/        # Markdown parser service
├── packages/shared/          # Shared TypeScript types
└── blog.db                   # SQLite database
```

## Tech Stack

**Frontend:** Vite 6 + React 19 + Tailwind CSS v4 + React Router v7 + SWR + Zustand + Recharts + TipTap

**Backend:** NestJS 11 + TypeORM + SQLite (better-sqlite3) + class-validator + @nestjs/config

**Monorepo:** pnpm workspaces

## Development Commands

**Start all services:**
```bash
pnpm dev
```

**Frontend (web/):**
```bash
cd web
pnpm dev        # Dev server on port 3000
pnpm build     # Production build
```

**Backend (server/):**
```bash
cd server
pnpm dev       # Dev with hot reload (port 8000)
pnpm build     # Production build
```

## Admin System

Admin panel at `/admin/login` - managed via environment variables.

**Setup:**
1. Create `server/.env` with admin credentials:
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
JWT_SECRET=your-secret-key
```
2. Server auto-creates admin user on startup if not exists
3. Login at `/admin/login`

**Admin API Routes (JWT protected):**
- `/api/admin/auth/login` - Login
- `/api/admin/articles` - Article CRUD
- `/api/admin/categories` - Category CRUD
- `/api/admin/tags` - Tag CRUD
- `/api/admin/visits/*` - Visit statistics (trend, geo, devices, browsers, os, referers)
- `/api/admin/upload/image` - Image upload (local storage in `public/uploads/`)

## Database

SQLite at `blog.db`. Tables: `articles`, `categories`, `tags`, `article_tags`, `visit_logs`, `admin_users`.

**Entities:**
- `Article` - id, slug, title, content, summary, viewCount, category, tags, visitLogs
- `Category` - id, name, slug, articles
- `Tag` - id, name, slug, articles
- `VisitLog` - id, articleId, ip, userAgent, referer, country, city, device, browser, os, visitedAt
- `AdminUser` - id, username, password (bcrypt), nickname

## Design System

- **Style**: Ink wash (水墨风格) - monochrome + warm accent
- **Fonts**: Ma Shan Zheng (titles), Noto Serif SC (body)
- **Colors**: Background #F5F5F0, Text #2D2D2D, Accent #8B4513

## Production Deployment

**PM2** (`ecosystem.config.js`):
```bash
pm2 start ecosystem.config.js --env production
```

Environment variables loaded from `server/.env` via `env_file` config.

**Nginx** (`nginx/`): Serves built frontend assets, proxies `/api/` to backend

**Rate limiting:** 100 req/min globally, 10 req/min for POST `/api/visits`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ADMIN_USERNAME` | Initial admin username |
| `ADMIN_PASSWORD` | Initial admin password |
| `JWT_SECRET` | JWT signing secret |
| `NODE_ENV` | production/development |
| `PORT` | Server port (default 8000) |

## Notes

- Monorepo uses pnpm workspaces
- Frontend uses SWR for data fetching, Zustand for state
- Visit tracking parses user-agent for device/browser/OS info
- Bots are filtered out from visit tracking by user-agent pattern matching
- Images uploaded via Admin are stored locally in `public/uploads/`
