# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog monorepo with **Vite + React frontend** and **NestJS backend**. Articles are Markdown files managed manually in `data/articles/`.

## Architecture

```
my-blog/
├── web/                      # Vite 6 + React 19 - frontend
│   └── src/
│       ├── main.tsx         # Entry point
│       ├── App.tsx          # AppLayout with Header/Footer
│       ├── routes.tsx       # React Router v7 routes
│       ├── pages/           # Page components
│       ├── components/      # UI components
│       ├── lib/api.ts       # API client
│       └── stores/          # Zustand state
├── server/                   # NestJS 11 - backend API
│   └── src/
│       ├── main.ts          # Bootstrap
│       ├── app.module.ts    # Root module
│       ├── article/         # Article module (controller, service, entity)
│       ├── category/        # Category module
│       ├── tag/             # Tag module
│       ├── search/          # Search module
│       ├── visit/           # Visit tracking module
│       └── markdown/        # Markdown parser service
├── packages/shared/          # Shared TypeScript types
├── data/articles/            # Markdown articles
└── blog.db                   # SQLite database
```

## Tech Stack

**Frontend:** Vite 6 + React 19 + Tailwind CSS v4 + React Router v7 + SWR + Zustand

**Backend:** NestJS 11 + TypeORM + SQLite (better-sqlite3) + class-validator

**Monorepo:** pnpm workspaces

## Development Commands

**Start all services (both servers + nginx):**
```bash
pnpm dev
```

**Frontend (web/):**
```bash
cd web
pnpm dev        # Dev server on port 3000
pnpm build     # Production build
pnpm lint      # ESLint
```

**Backend (server/):**
```bash
cd server
pnpm dev       # Dev with hot reload (port 8000)
pnpm build     # Production build
pnpm test      # Jest tests
```

**Start backend directly:**
```bash
cd server && pnpm start:dev
```

## Article System

Articles are Markdown files in `data/articles/`. Create a new article by adding a `.md` file:

```markdown
---
title: "文章标题"
slug: "article-slug"
summary: "文章简介"
category: "技术"
tags: ["React", "TypeScript"]
created_at: "2026-04-09"
---

正文内容...
```

**Front matter fields:**
- `title` (required) - Article title
- `slug` (optional) - URL slug, defaults to filename
- `summary` (optional) - Brief description
- `category` (optional, default: "未分类") - Category name
- `tags` (optional, default: []) - Array of tag names
- `created_at` (optional) - Publication date

Backend auto-syncs articles from `data/articles/` on startup.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/articles` | List articles (`?category=`, `?tag=`, `?page=`, `?page_size=`) |
| GET | `/api/articles/:slug` | Get single article |
| GET | `/api/categories` | List categories with article counts |
| GET | `/api/tags` | List tags with article counts |
| GET | `/api/search?q=` | Search articles |
| POST | `/api/visits` | Record visit (rate-limited: 10/min) |
| GET | `/api/visits/stats` | Get total visit count |

Frontend proxies `/api/*` to backend at `http://localhost:8000`.

## Database

SQLite at `blog.db`. Tables: `articles`, `categories`, `tags`, `article_tags`, `visit_logs`.

**Entities:**
- `Article` - id, slug, title, content, summary, viewCount, category, tags, visitLogs
- `Category` - id, name, slug, articles
- `Tag` - id, name, slug, articles
- `VisitLog` - id, articleId, ip, userAgent, referer, country, city, device, browser, os, visitedAt

## Design System

- **Style**: Ink wash (水墨风格) - monochrome + warm accent
- **Fonts**: Ma Shan Zheng (titles), Noto Serif SC (body)
- **Colors**: Background #F5F5F0, Text #2D2D2D, Accent #8B4513

## Production Deployment

**PM2** (`ecosystem.config.js`): Runs backend and nginx as processes

**Nginx** (`nginx/`): Serves built frontend assets, proxies `/api/` to backend

**Rate limiting:** 100 req/min globally, 10 req/min for POST `/api/visits`

## Notes

- Monorepo uses pnpm workspaces
- Frontend uses SWR for data fetching, Zustand for state
- Visit tracking parses user-agent for device/browser/OS info
- Bots are filtered out from visit tracking by user-agent pattern matching
