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

# 检查项目目录是否存在
PROJECT_DIR="/var/www/trx-energy-rental"
if [ -d "$PROJECT_DIR" ]; then
    print_warn "项目目录已存在，是否继续？(y/n)"
    read -r response
    if [[ "$response" != "y" ]]; then
        print_error "操作已取消"
        exit 1
    fi
    rm -rf "$PROJECT_DIR"
fi

# 更新系统
print_info "正在更新系统..."
apt-get update
check_result "系统更新失败"
apt-get upgrade -y
check_result "系统升级失败"

# 安装必要的依赖
print_info "正在安装系统依赖..."
apt-get install -y curl wget git build-essential
check_result "系统依赖安装失败"

# 安装Node.js
print_info "正在安装Node.js..."
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
check_result "Node.js源配置失败"
apt-get install -y nodejs
check_result "Node.js安装失败"

# 验证Node.js安装
node_version=$(node -v)
print_info "Node.js版本: $node_version"

# 安装MongoDB
print_info "正在安装MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
check_result "MongoDB密钥添加失败"
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
apt-get update
apt-get install -y mongodb-org
check_result "MongoDB安装失败"

# 启动MongoDB
print_info "正在启动MongoDB服务..."
systemctl start mongod
check_result "MongoDB启动失败"
systemctl enable mongod
check_result "MongoDB自启配置失败"

# 安装PM2
print_info "正在安装PM2..."
npm install -g pm2
check_result "PM2安装失败"

# 创建项目目录
print_info "正在创建项目目录..."
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"
check_result "项目目录创建失败"

# 克隆项目代码
print_info "正在克隆项目代码..."
git clone https://github.com/your-repo/trx-energy-rental.git .
check_result "项目代码克隆失败"

# 验证项目结构
if [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "项目结构不完整，请检查代码仓库"
    exit 1
fi

# 安装项目依赖
print_info "正在安装项目依赖..."
npm install
check_result "后端依赖安装失败"
cd client
npm install
check_result "前端依赖安装失败"
cd ..

# 创建环境配置文件
print_info "正在创建环境配置文件..."
cat > .env << EOL
# Network Configuration
TRON_NETWORK=nile
TRON_FULL_NODE=https://api.nileex.io/
TRON_SOLIDITY_NODE=https://api.nileex.io/
TRON_EVENT_SERVER=https://event.nileex.io/

# Address Configuration
ADDRESS_A=TNUhNBhfZtSFwVPk9XmnDHMTf2jCju2uMW
ADDRESS_A_PRIVATE_KEY=2b2260bf526b833dab78aa116c6085b936d000058b95448d1a07b5649f39d049
ADDRESS_B=TTrKUfrvQ8Zchk9KrvGBCiioq14oCRWUgA
ADDRESS_B_PRIVATE_KEY=1df3ce619da22853ad29690be21766a008d596a150bff134292371a8636abb82

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=7909502814:AAGFp5mSxvsTsEx-4p5gT4Yj3XUItd0SPag

# API Configuration
TRONSTACK_API_KEY=174a036e-e16a-4e47-a172-65cf48579fbd
TRONSTACK_API_URL=https://api.tronstack.io

# Server Configuration
PORT=3001
MONGODB_URI=mongodb://localhost:27017/trx-energy-rental

# Domain
DOMAIN=202p.com
EOL
check_result "环境配置文件创建失败"

# 构建前端
print_info "正在构建前端..."
cd client
npm run build
check_result "前端构建失败"
cd ..

# 配置Nginx
print_info "正在配置Nginx..."
apt-get install -y nginx
check_result "Nginx安装失败"

cat > /etc/nginx/sites-available/trx-energy-rental << EOL
server {
    listen 80;
    server_name 202p.com;

    location / {
        root /var/www/trx-energy-rental/client/build;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL
check_result "Nginx配置文件创建失败"

ln -sf /etc/nginx/sites-available/trx-energy-rental /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
check_result "Nginx配置检查失败"
systemctl restart nginx
check_result "Nginx重启失败"

# 配置SSL证书
print_info "正在配置SSL证书..."
apt-get install -y certbot python3-certbot-nginx
check_result "Certbot安装失败"
certbot --nginx -d 202p.com --non-interactive --agree-tos --email admin@202p.com
check_result "SSL证书配置失败"

# 启动应用
print_info "正在启动应用..."
pm2 delete trx-energy-rental 2>/dev/null || true
pm2 start server/index.js --name "trx-energy-rental"
check_result "应用启动失败"
pm2 save
check_result "PM2配置保存失败"
pm2 startup | grep -v "sudo" | bash
check_result "PM2自启配置失败"

# 设置文件权限
print_info "正在设置文件权限..."
chown -R www-data:www-data "$PROJECT_DIR"
chmod -R 755 "$PROJECT_DIR"
check_result "文件权限设置失败"

print_info "部署完成！"
print_info "请访问 https://202p.com 查看网站"
print_info "后台管理地址：https://202p.com/admin"
print_info "Telegram机器人：https://t.me/your_bot_username"

# 显示部署状态
print_info "正在检查部署状态..."
echo "=== Node.js版本 ==="
node -v
echo "=== MongoDB状态 ==="
systemctl status mongod | grep Active
echo "=== Nginx状态 ==="
systemctl status nginx | grep Active
echo "=== PM2进程状态 ==="
pm2 list 