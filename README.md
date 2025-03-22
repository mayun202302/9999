# TRX Energy Rental System

TRX能量租赁系统，包含Web界面和Telegram机器人。

## 功能特点

- 支持中英双语
- 响应式设计，适配手机访问
- 后台管理系统
- Telegram机器人集成
- 自动能量代理和回收
- 地址池管理

## 系统要求

- Node.js >= 14
- MongoDB >= 4.4
- npm >= 6

## 安装步骤

1. 克隆项目
```bash
git clone [项目地址]
cd trx-energy-rental
```

2. 安装依赖
```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
cd ..
```

3. 配置环境变量
复制 `.env.example` 文件为 `.env`，并填写必要的配置信息：
```
# Network Configuration
TRON_NETWORK=nile
TRON_FULL_NODE=https://api.nileex.io/
TRON_SOLIDITY_NODE=https://api.nileex.io/
TRON_EVENT_SERVER=https://event.nileex.io/

# Address Configuration
ADDRESS_A=你的A地址
ADDRESS_A_PRIVATE_KEY=你的A地址私钥
ADDRESS_B=你的B地址
ADDRESS_B_PRIVATE_KEY=你的B地址私钥

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=你的机器人Token

# API Configuration
TRONSTACK_API_KEY=你的API密钥
TRONSTACK_API_URL=https://api.tronstack.io

# Server Configuration
PORT=3001
MONGODB_URI=mongodb://localhost:27017/trx-energy-rental

# Domain
DOMAIN=你的域名
```

4. 启动MongoDB
确保MongoDB服务已经启动。

5. 运行项目
```bash
# 开发模式
npm run dev:full

# 生产模式
npm start
```

## 使用说明

1. 访问网站
- 开发环境：http://localhost:3000
- 生产环境：https://你的域名

2. 访问后台管理
- 开发环境：http://localhost:3000/admin
- 生产环境：https://你的域名/admin

3. 使用Telegram机器人
- 在Telegram中搜索你的机器人用户名
- 发送 /start 开始使用

## 注意事项

1. 确保A地址已经质押了足够的TRX以获得能量
2. 确保A地址已经授权B地址的代理资源2.0和回收资源2.0权限
3. 定期检查地址池状态，确保有足够的可用地址
4. 监控系统日志，及时发现和处理异常情况

## 安全建议

1. 定期更换私钥
2. 使用HTTPS协议
3. 设置访问IP白名单
4. 定期备份数据库
5. 监控异常交易

## 技术支持

如有问题，请联系技术支持。 