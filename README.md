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
│       ├── article/      # 文章模块
│       ├── category/    # 分类模块
│       ├── tag/         # 标签模块
│       ├── search/       # 搜索模块
│       └── visit/       # 访问记录模块
├── data/
│   └── articles/        # Markdown 文章
├── nginx.conf           # Nginx 配置 (反向代理 + HTTPS)
├── ssl/                  # SSL 证书目录 (不上传)
├── docker-compose.yml    # Docker 编排
└── deploy.sh            # 一键部署脚本
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

### 一键部署

```bash
./deploy.sh
```

脚本会自动：1. 拉取最新代码
2. 构建前端
3. 启动 Docker 容器

### 手动部署

```bash
# 1. 克隆仓库
git clone https://github.com/AutoByte-9527/my-blog.git
cd my-blog

# 2. 构建前端
cd web && pnpm install && pnpm build && cd ..

# 3. 启动服务
docker-compose up -d
```

访问 `http://服务器IP` 即可。

### HTTPS 配置

1. 申请 SSL 证书，放入 `ssl/` 目录：
   ```
   ssl/
   ├── fullchain.pem
   └── privkey.pem
   ```

2. 修改 `nginx.conf`，取消 HTTPS server 块的注释：
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;  # 改成你的域名
       ...
   }
   ```

3. 修改 `docker-compose.yml`，取消 443 端口注释：
   ```yaml
   ports:
     - "80:80"
     - "443:443"
   ```

4. 重启：
   ```bash
   docker-compose restart nginx
   ```

### HTTP 自动跳转 HTTPS

启用 HTTPS 后，80 端口的 HTTP 请求会自动跳转到 443。

### 架构

```
                    ┌─────────────┐
                    │   Nginx     │
浏览器 ─────────────┤  (反向代理)  │
                    │  80 / 443   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌─────────┐  ┌───────────┐  ┌─────────┐
        │  静态文件 │  │   API     │  │         │
        │  (SPA)  │  │ :8000     │  │         │
        └─────────┘  └───────────┘  └─────────┘
```

- **80**: HTTP，跳转 HTTPS
- **443**: HTTPS，处理所有请求
- **8000**: 仅内部访问，对外隐藏

## 设计

- **风格**：水墨风格 (Ink Wash)
- **配色**：背景 #F5F5F0，文字 #2D2D2D，强调色 #8B4513
- **字体**：系统字体
- **页面过渡**：淡入动画 (250ms)

## License

MIT
