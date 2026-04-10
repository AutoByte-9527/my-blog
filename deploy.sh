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
    echo "[1/5] 初始化 Git 仓库..."
    git init
    git remote add origin "$REPO_URL"
fi

# 2. 拉取最新代码
echo "[2/5] 拉取最新代码..."
git pull origin "$BRANCH"

# 3. 构建前端
echo "[3/5] 构建前端..."
cd web
pnpm install --frozen-lockfile
pnpm build
cd ..

# 4. 检查 Nginx 配置
echo "[4/5] 检查 Nginx 配置..."
if [ ! -f "./nginx/nginx.conf" ]; then
    echo "错误: Nginx 配置文件不存在"
    exit 1
fi
echo "Nginx 配置检查通过"

# 5. 启动服务
echo "[5/5] 启动服务..."
# 启动后端
cd server
nohup pnpm start:prod > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
mkdir -p logs
echo "后端已启动 (PID: $BACKEND_PID)"

# 启动 Nginx
./nginx/nginx.sh start

echo ""
echo "=== 部署完成 ==="
echo "访问 http://localhost:8080"
echo ""
echo "常用命令："
echo "  后端日志：tail -f logs/backend.log"
echo "  Nginx日志：tail -f nginx/logs/error.log"
echo "  Nginx管理：./nginx/nginx.sh [start|stop|restart|reload|status]"
echo "  重启后端：pkill -f 'node.*dist/main' && cd server && nohup pnpm start:prod > ../logs/backend.log 2>&1 &"
