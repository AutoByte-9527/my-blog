# My Blog

基于 Vite + React + NestJS 的个人博客，使用 Markdown 文件管理文章。

## 技术栈

| 前端 | 后端 | 数据库 | 部署 |
|------|------|--------|------|
| Vite 6 + React 19 | NestJS 11 | SQLite | Docker + Nginx |

## 项目结构

```
my-blog/
├── web/                 # 前端 (Vite + React)
│   ├── src/
│   │   ├── pages/       # 页面组件
│   │   ├── components/  # UI 组件
│   │   ├── lib/         # API 客户端
│   │   └── stores/      # Zustand 状态管理
│   └── dist/            # 构建产物
├── server/              # 后端 (NestJS)
│   └── src/
│       ├── article/     # 文章模块
│       ├── category/    # 分类模块
│       ├── tag/         # 标签模块
│       └── visit/       # 访问记录模块
├── data/
│   └── articles/        # Markdown 文章
├── nginx.conf           # Nginx 配置
└── docker-compose.yml   # Docker 编排
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
./dev.sh

# 或者分别启动
cd web && pnpm dev      # 前端: http://localhost:3000
cd server && pnpm dev   # 后端: http://localhost:8000
```

## 文章系统

在 `data/articles/` 目录添加 Markdown 文件：

```markdown
---
title: "文章标题"
slug: "article-slug"
summary: "文章简介"
category: "技术"
tags: ["Git", "版本控制"]
created_at: "2026-04-09"
---

正文内容...
```

Slug 用于 URL：`/articles/{slug}`

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/articles` | 文章列表 |
| GET | `/api/articles/:slug` | 文章详情 |
| GET | `/api/categories` | 分类列表 |
| GET | `/api/tags` | 标签列表 |
| GET | `/api/search?q=` | 搜索 |

## 生产部署

### Docker 部署

```bash
# 1. 构建前端
cd web && pnpm build && cd ..

# 2. 启动服务
docker-compose up -d
```

访问 `http://服务器IP` 即可。

### HTTPS 配置

1. 申请 SSL 证书，放入 `ssl/` 目录
2. 取消 `nginx.conf` 中 HTTPS server 块的注释
3. 修改 `server_name` 为你的域名
4. 重启：`docker-compose restart nginx`

### 仅开放 80/443 端口

后端 8000 端口通过 Nginx 内部代理，对外不可见。

## 设计

- **风格**：水墨风格 (Ink Wash)
- **配色**：背景 #F5F5F0，文字 #2D2D2D，强调色 #8B4513
- **字体**：系统字体

## License

MIT
