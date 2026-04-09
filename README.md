# My Blog

基于 Vite + React + NestJS 的个人博客，Markdown 文件管理文章。

## 技术栈

- 前端：Vite 6 + React 19 + Tailwind CSS
- 后端：NestJS 11 + SQLite
- 部署：Docker + Nginx

## 开发

```bash
pnpm install
./dev.sh
```

## 部署

```bash
./deploy.sh
```

访问 `http://服务器IP`

## HTTPS

1. 证书放入 `ssl/` 目录
2. 修改 `nginx.conf` 和 `docker-compose.yml` 中的 HTTPS 配置
3. `docker-compose restart nginx`

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
