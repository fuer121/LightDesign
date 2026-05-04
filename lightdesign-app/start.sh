#!/bin/bash
# LightDesign 本地启动脚本
# 用法: bash start.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "============================================"
echo "  LightDesign — AI 电商产品主图生成"
echo "============================================"

# 1. 检查 Node.js
if ! command -v node &>/dev/null; then
  echo "[错误] 未找到 Node.js，请先安装 Node.js 18+"
  exit 1
fi
echo "[OK] Node.js $(node -v)"

# 2. 安装依赖（仅当 node_modules 不完整时）
if [ ! -d "node_modules/@phosphor-icons/react" ] || [ ! -d "node_modules/next" ]; then
  echo "[...] 安装依赖..."
  npm install
else
  echo "[OK] 依赖已安装"
fi

# 3. 检查端口
PORT=3000
if lsof -i :$PORT &>/dev/null 2>&1; then
  echo "[警告] 端口 $PORT 已被占用，尝试使用 3001"
  PORT=3001
fi

# 4. 启动
echo ""
echo "[启动] 开发服务器 → http://localhost:$PORT"
echo ""
npm run dev -- --port $PORT
