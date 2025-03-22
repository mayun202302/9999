# TRX Energy Rental System 部署指南

## 系统要求

- Ubuntu 20.04 LTS 或更高版本
- 至少 2GB RAM
- 至少 20GB 磁盘空间
- 域名已正确解析到服务器IP

## 部署步骤

1. 下载部署脚本
```bash
wget https://raw.githubusercontent.com/your-repo/trx-energy-rental/main/deploy.sh
```

2. 添加执行权限
```bash
chmod +x deploy.sh
```

3. 使用root权限运行脚本
```bash
sudo ./deploy.sh
```

## 脚本功能说明

该脚本会自动完成以下操作：

1. 系统更新和依赖安装
   - 更新系统包
   - 安装必要的系统依赖
   - 安装Node.js 16.x
   - 安装MongoDB 4.4
   - 安装PM2进程管理器

2. 项目部署
   - 创建项目目录
   - 克隆项目代码
   - 安装项目依赖
   - 配置环境变量
   - 构建前端代码

3. Web服务器配置
   - 安装和配置Nginx
   - 配置SSL证书
   - 设置反向代理

4. 应用启动
   - 使用PM2启动后端服务
   - 配置开机自启
   - 设置文件权限

## 注意事项

1. 运行脚本前请确保：
   - 使用root权限
   - 域名已正确解析
   - 服务器防火墙已开放80和443端口

2. 部署完成后：
   - 检查网站是否正常访问
   - 检查后台管理是否正常
   - 检查Telegram机器人是否正常响应

3. 安全建议：
   - 及时修改默认密码
   - 定期更新系统和依赖
   - 配置防火墙规则
   - 定期备份数据库

## 常见问题

1. 如果遇到权限问题：
```bash
sudo chown -R $USER:$USER /var/www/trx-energy-rental
```

2. 如果需要重启服务：
```bash
sudo systemctl restart nginx
pm2 restart trx-energy-rental
```

3. 如果需要查看日志：
```bash
pm2 logs trx-energy-rental
```

## 维护命令

1. 更新代码：
```bash
cd /var/www/trx-energy-rental
git pull
npm install
cd client
npm install
npm run build
pm2 restart trx-energy-rental
```

2. 备份数据库：
```bash
mongodump --db trx-energy-rental --out /backup/$(date +%Y%m%d)
```

3. 恢复数据库：
```bash
mongorestore --db trx-energy-rental /backup/20240301/trx-energy-rental
```

## 技术支持

如遇到问题，请联系技术支持。 