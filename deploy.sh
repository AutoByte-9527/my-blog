#!/bin/bash
set -e

echo "=== My Blog 部署脚本 ==="

# 配置
REPO_URL="https://github.com/AutoByte-9527/my-blog.git"
BRANCH="master"

# 进入项目目录
cd "$(dirname "$0")"

# 1. 如果不是 git 仓库，则克隆
if [ ! -d ".git" ]; then
    echo "[1/4] 初始化 Git 仓库..."
    git init
    git remote add origin "$REPO_URL"
fi

# 2. 拉取最新代码
echo "[2/4] 拉取最新代码..."
git pull origin "$BRANCH"

# 3. 安装依赖并构建前端
echo "[3/4] 构建前端..."
cd web
pnpm install --frozen-lockfile
pnpm build
cd ..

# 4. 启动/重建 Docker 容器
echo "[4/4] 启动 Docker 容器..."
docker-compose up -d --build

echo ""
echo "=== 部署完成 ==="
echo "访问 http://服务器IP"
echo ""
echo "常用命令："
echo "  查看日志：docker-compose logs -f"
echo "  停止服务：docker-compose down"
echo "  重启服务：docker-compose restart"
