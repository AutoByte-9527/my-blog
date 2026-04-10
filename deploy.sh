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
    echo "[1/3] 初始化 Git 仓库..."
    git init
    git remote add origin "$REPO_URL"
fi

# 2. 拉取最新代码
echo "[2/3] 拉取最新代码..."
git pull origin "$BRANCH"

# 3. 构建前端
echo "[3/3] 构建前端..."
cd web
pnpm install --frozen-lockfile
pnpm build
cd ..

echo ""
echo "=== 部署完成 ==="
echo "运行以下命令启动服务："
echo "  后端：cd server && uvicorn src.main:app --host 0.0.0.0 --port 8000"
echo "  前端：cd web && pnpm dev"
