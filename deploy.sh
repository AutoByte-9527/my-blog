#!/bin/bash
set -e

echo "=== My Blog 部署脚本 ==="

# 进入项目目录
cd "$(dirname "$0")"

# 1. 构建前端
echo "[1/3] 构建前端..."
cd web
pnpm install --frozen-lockfile
pnpm build
cd ..

# 2. 拉取最新代码（如果使用 git）
if [ -d ".git" ]; then
    echo "[2/3] 拉取最新代码..."
    git pull
fi

# 3. 启动/重启 Docker 容器
echo "[3/3] 启动 Docker 容器..."
docker-compose up -d --build

echo ""
echo "=== 部署完成 ==="
echo "访问 http://服务器IP"
echo ""
echo "常用命令："
echo "  查看日志：docker-compose logs -f"
echo "  停止服务：docker-compose down"
echo "  重启服务：docker-compose restart"
