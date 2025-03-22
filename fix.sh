#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 打印带颜色的信息
print_info() {
    echo -e "${GREEN}[INFO] $1${NC}"
}

print_warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

print_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

# 检查命令执行结果
check_result() {
    if [ $? -ne 0 ]; then
        print_error "$1"
        exit 1
    fi
}

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
    print_error "请使用root权限运行此脚本"
    exit 1
fi

PROJECT_DIR="/var/www/trx-energy-rental"

# 检查项目目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "项目目录不存在，请先运行 deploy.sh"
    exit 1
fi

cd "$PROJECT_DIR"
check_result "进入项目目录失败"

# 检查是否为git仓库
if [ ! -d ".git" ]; then
    print_info "初始化git仓库..."
    git init
    git remote add origin https://github.com/your-repo/trx-energy-rental.git
    git fetch
    git reset --hard origin/main
    check_result "代码拉取失败"
fi

# 检查项目结构
if [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "项目结构不完整，请检查代码仓库"
    exit 1
fi

# 安装依赖
print_info "安装后端依赖..."
npm install
check_result "后端依赖安装失败"

print_info "安装前端依赖..."
cd client
npm install
check_result "前端依赖安装失败"
cd ..

# 构建前端
print_info "构建前端..."
cd client
npm run build
check_result "前端构建失败"
cd ..

# 重启服务
print_info "重启服务..."
pm2 delete trx-energy-rental 2>/dev/null || true
pm2 start server/index.js --name "trx-energy-rental"
check_result "服务启动失败"
pm2 save

print_info "修复完成！"
print_info "正在检查服务状态..."
echo "=== Node.js版本 ==="
node -v
echo "=== MongoDB状态 ==="
systemctl status mongod | grep Active
echo "=== Nginx状态 ==="
systemctl status nginx | grep Active
echo "=== PM2进程状态 ==="
pm2 list 