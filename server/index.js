require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const TronWeb = require('tronweb');

const app = express();
const port = process.env.PORT || 3001;

// 中间件配置
app.use(cors());
app.use(express.json());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// TronWeb 配置
const tronWeb = new TronWeb({
    fullHost: process.env.TRON_FULL_NODE,
    privateKey: process.env.ADDRESS_B_PRIVATE_KEY,
    headers: { "TRON-PRO-API-KEY": process.env.TRONSTACK_API_KEY }
});

// Telegram Bot 配置
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// 路由配置
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Telegram Bot 命令处理
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['10分钟特价能量'],
                ['钱包查询', '地址监听'],
                ['申请代理', '语言选择']
            ],
            resize_keyboard: true
        }
    };
    bot.sendMessage(chatId, '欢迎使用TRX能量租赁机器人！\nWelcome to TRX Energy Rental Bot!', keyboard);
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 