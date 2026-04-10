#!/bin/bash

# Nginx 管理脚本
# 用法: ./nginx.sh [start|stop|restart|reload|status]

NGINX_DIR="$(cd "$(dirname "$0")" && pwd)"
NGINX_BIN="${NGINX_DIR}/nginx"
NGINX_CONF="${NGINX_DIR}/nginx.conf"

# 优先使用系统 nginx
if [ ! -f "$NGINX_BIN" ]; then
    if command -v nginx &>/dev/null; then
        NGINX_BIN=$(command -v nginx)
    fi
fi

# 检查配置
check_config() {
    if [ ! -f "$NGINX_CONF" ]; then
        echo "错误: 配置文件不存在: $NGINX_CONF"
        exit 1
    fi
}

# 检查 nginx 是否运行
is_running() {
    if [ -f "$NGINX_DIR/logs/nginx.pid" ]; then
        local pid=$(cat "$NGINX_DIR/logs/nginx.pid")
        if kill -0 "$pid" 2>/dev/null; then
            return 0
        fi
    fi
    return 1
}

# 获取 PID
get_pid() {
    if [ -f "$NGINX_DIR/logs/nginx.pid" ]; then
        cat "$NGINX_DIR/logs/nginx.pid"
    fi
}

# 启动
start() {
    if is_running; then
        echo "Nginx 已在运行 (PID: $(get_pid))"
        return
    fi

    check_config

    echo "启动 Nginx..."
    $NGINX_BIN -c "$NGINX_CONF"
    sleep 1

    if is_running; then
        echo "Nginx 已启动 (PID: $(get_pid))"
    else
        echo "Nginx 启动失败，请检查日志: $NGINX_DIR/logs/error.log"
        exit 1
    fi
}

# 停止
stop() {
    if ! is_running; then
        echo "Nginx 未运行"
        return
    fi

    echo "停止 Nginx..."
    local pid=$(get_pid)
    kill -TERM "$pid" 2>/dev/null

    # 等待进程退出
    local count=0
    while kill -0 "$pid" 2>/dev/null && [ $count -lt 10 ]; do
        sleep 0.5
        count=$((count + 1))
    done

    # 如果还在运行，强制杀死
    if kill -0 "$pid" 2>/dev/null; then
        echo "强制杀死 Nginx..."
        kill -9 "$pid" 2>/dev/null
    fi

    # 删除 pid 文件
    rm -f "$NGINX_DIR/logs/nginx.pid"
    echo "Nginx 已停止"
}

# 重启
restart() {
    stop
    sleep 1
    start
}

# 重载配置
reload() {
    if ! is_running; then
        echo "Nginx 未运行，请先启动"
        exit 1
    fi

    echo "重载 Nginx 配置..."
    kill -HUP "$(get_pid)"
    echo "配置已重载"
}

# 状态
status() {
    if is_running; then
        echo "Nginx 运行中 (PID: $(get_pid))"
    else
        echo "Nginx 未运行"
    fi
}

# 帮助
help() {
    echo "用法: $0 [command]"
    echo ""
    echo "命令:"
    echo "  start   - 启动 Nginx"
    echo "  stop    - 停止 Nginx"
    echo "  restart - 重启 Nginx"
    echo "  reload  - 重载配置"
    echo "  status  - 查看状态"
    echo "  help    - 显示帮助"
}

# 主逻辑
case "${1:-help}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    reload)
        reload
        ;;
    status)
        status
        ;;
    help|*)
        help
        ;;
esac
