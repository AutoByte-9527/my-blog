# My Blog

基于 Vite + React + NestJS 的个人博客，Markdown 文件管理文章。

## 架构

```
my-blog/
├── web/                      # Vite 6 + React 19 - 前端
│   └── src/
│       ├── main.tsx         # 入口
│       ├── App.tsx          # AppLayout + Header/Footer
│       ├── routes.tsx       # React Router v7 路由
│       ├── pages/           # 页面组件
│       ├── components/      # UI 组件
│       ├── lib/api.ts       # API 客户端
│       └── stores/          # Zustand 状态
├── server/                   # NestJS 11 - 后端 API
│   └── src/
│       ├── article/         # 文章模块
│       ├── category/         # 分类模块
│       ├── tag/              # 标签模块
│       ├── search/           # 搜索模块
│       ├── visit/            # 访问追踪模块
│       └── markdown/         # Markdown 解析服务
├── packages/shared/          # 共享 TypeScript 类型
└── data/articles/            # Markdown 文章
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vite 6 + React 19 + Tailwind CSS v4 + React Router v7 + SWR + Zustand |
| 后端 | NestJS 11 + TypeORM + SQLite (better-sqlite3) + class-validator |
| 部署 | PM2 + Nginx |
| Monorepo | pnpm workspaces |

## 开发

**安装依赖：**
```bash
pnpm install
```

**启动全部服务（前端 + 后端 + nginx）：**
```bash
pnpm dev
```

**单独启动：**
```bash
cd web && pnpm dev      # 前端 on http://localhost:3000
cd server && pnpm dev   # 后端 on http://localhost:8000
```

**生产构建：**
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

**Front matter 字段：**
- `title`（必填）- 文章标题
- `slug`（可选）- URL slug，默认使用文件名
- `summary`（可选）- 简介
- `category`（可选，默认"未分类"）- 分类
- `tags`（可选，默认[]）- 标签数组
- `created_at`（可选）- 发布日期

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/articles` | 文章列表 (`?category=`, `?tag=`, `?page=`, `?page_size=`) |
| GET | `/api/articles/:slug` | 文章详情 |
| GET | `/api/categories` | 分类列表（含文章数） |
| GET | `/api/tags` | 标签列表（含文章数） |
| GET | `/api/search?q=` | 搜索文章 |
| POST | `/api/visits` | 记录访问（限速 10/min） |
| GET | `/api/visits/stats` | 访问统计 |

API 文档：`http://localhost:8000/docs`

## 数据库

SQLite 数据库 `blog.db`，表：articles, categories, tags, article_tags, visit_logs
