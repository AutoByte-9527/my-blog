#!/bin/bash

# 后端启动脚本（生产环境）
# 使用 pm2 启动: pm2 start ecosystem.config.js --env production

cd "$(dirname "$0")"

pm2 start ecosystem.config.js --env production
