# My Blog

基于 Vite + React + NestJS 的个人博客，Markdown 文件管理文章。

## 技术栈

- 前端：Vite 6 + React 19 + Tailwind CSS v4 + React Router v7
- 后端：NestJS 11 + TypeORM + SQLite
- 部署：PM2 + Nginx
- Monorepo：pnpm workspaces

## 开发

```bash
pnpm install
pnpm dev
```

访问 `http://localhost:3000`（前端）、`http://localhost:8000`（后端 API）

## 生产部署

```bash
pnpm build
pm2 start ecosystem.config.js
```

## 文章

在 `data/articles/` 添加 Markdown 文件，front matter：

```yaml
---
title: "标题"
slug: "url-slug"
summary: "简介"
category: "分类"
tags: ["标签"]
created_at: "2026-04-09"
---
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/articles` | 文章列表 |
| GET | `/api/articles/:slug` | 文章详情 |
| GET | `/api/categories` | 分类列表 |
| GET | `/api/tags` | 标签列表 |
| GET | `/api/search?q=` | 搜索 |
| POST | `/api/visits` | 记录访问 |

文档：`http://localhost:8000/docs`
