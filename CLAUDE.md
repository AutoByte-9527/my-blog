# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog monorepo with **Next.js frontend** and **FastAPI backend**. Articles are Markdown files managed manually in `data/articles/`.

## Architecture

```
my-blog/
├── web/                    # Next.js 16 (App Router) - frontend
│   └── src/
│       ├── app/           # Pages: /, /articles/[slug], /categories/[slug], /tags/[slug], /archives, /search
│       ├── components/    # UI components
│       ├── lib/          # API client, types
│       └── stores/        # Zustand state
├── server/                # FastAPI - backend API
│   └── src/
│       ├── main.py       # FastAPI app entry
│       ├── models.py    # SQLAlchemy models
│       ├── schemas.py    # Pydantic schemas
│       ├── database.py   # SQLite connection
│       ├── routes/       # API endpoints
│       └── utils/        # Markdown parser
└── data/
    └── articles/         # Markdown articles (managed manually)
```

## Development Commands

**Start both servers:**
```bash
./dev.sh
```

**Backend (server/):**
```bash
cd server
uv sync                              # Install deps
.venv/bin/uvicorn src.main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

**Frontend (web/):**
```bash
cd web
pnpm install                         # Install deps
pnpm dev                             # Dev server
pnpm build                           # Production build
```

## Article System

Articles are Markdown files in `data/articles/`. Create a new article by adding a `.md` file:

```markdown
---
title: "文章标题"
slug: "article-slug"
summary: "文章简介"
category: "技术"
tags: ["Python", "FastAPI"]
created_at: "2026-04-09"
---

正文内容...
```

Slug is used for URL: `/articles/{slug}`. Backend auto-syncs articles on startup/request.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/articles` | List articles (supports `?category=`, `?tag=`, `?page=`) |
| GET | `/api/articles/{slug}` | Get single article |
| GET | `/api/categories` | List categories with article counts |
| GET | `/api/tags` | List tags with article counts |
| GET | `/api/search?q=` | Search articles |
| POST | `/api/visits` | Record visit (rate-limited: 10/min per IP) |

Frontend proxies API via `NEXT_PUBLIC_API_URL` env var (default: `http://localhost:8000`).

## Design System

- **Style**: Ink wash (水墨风格) - monochrome + warm accent
- **Fonts**: Ma Shan Zheng (titles), Noto Serif SC (body)
- **Colors**: Background #F5F5F0, Text #2D2D2D, Accent #8B4513

## Database

SQLite at `server/blog.db`. Tables: `articles`, `categories`, `tags`, `article_tags`, `visit_logs`.

## Notes

- README.md may contain outdated info (cover_image removed, use pnpm not npm)
- Backend uses `uv` for Python package management
- Frontend uses `pnpm` for Node package management
