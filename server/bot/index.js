const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const i18next = require('i18next');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// 用户语言设置存储
const userLanguages = new Map();

// 创建键盘
const createKeyboard = (lang) => ({
  reply_markup: {
    keyboard: [
      [lang === 'zh' ? '10分钟特价能量' : '10-Minute Special Energy'],
      [
        lang === 'zh' ? '钱包查询' : 'Wallet Query',
        lang === 'zh' ? '地址监听' : 'Address Monitor'
      ],
      [
        lang === 'zh' ? '申请代理' : 'Apply Proxy',
        lang === 'zh' ? '语言选择' : 'Language'
      ]
    ],
    resize_keyboard: true
  }
});

// 处理 /start 命令
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const lang = userLanguages.get(chatId) || 'zh';
  
  const welcomeMessage = lang === 'zh' 
    ? '欢迎使用TRX能量租赁机器人！'
    : 'Welcome to TRX Energy Rental Bot!';

  bot.sendMessage(chatId, welcomeMessage, createKeyboard(lang));
});

// 处理文本消息
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const lang = userLanguages.get(chatId) || 'zh';

  if (text === (lang === 'zh' ? '10分钟特价能量' : '10-Minute Special Energy')) {
    try {
      const response = await axios.post('/api/orders/create', {
        userAddress: msg.from.id.toString() // 使用用户ID作为临时地址
      });

      const message = lang === 'zh'
        ? `正在创建支付订单...\n\n支付地址：${response.data.paymentAddress}`
        : `Creating payment order...\n\nPayment Address: ${response.data.paymentAddress}`;

      bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [[
            {
              text: lang === 'zh' ? '复制地址' : 'Copy Address',
              callback_data: `copy_${response.data.paymentAddress}`
            }
          ]]
        }
      });
    } catch (error) {
      const errorMessage = lang === 'zh'
        ? '创建订单失败，请稍后重试'
        : 'Failed to create order, please try again later';
      
      bot.sendMessage(chatId, errorMessage);
    }
  } else if (text === (lang === 'zh' ? '钱包查询' : 'Wallet Query') ||
             text === (lang === 'zh' ? '地址监听' : 'Address Monitor') ||
             text === (lang === 'zh' ? '申请代理' : 'Apply Proxy')) {
    const message = lang === 'zh'
      ? '暂未开放'
      : 'Not Available';
    
    bot.sendMessage(chatId, message);
  } else if (text === (lang === 'zh' ? '语言选择' : 'Language')) {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    userLanguages.set(chatId, newLang);
    
    const message = newLang === 'zh'
      ? '已切换到中文'
      : 'Switched to English';
    
    bot.sendMessage(chatId, message, createKeyboard(newLang));
  }
});

// 处理回调查询
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  const lang = userLanguages.get(chatId) || 'zh';

  if (data.startsWith('copy_')) {
    const address = data.split('_')[1];
    const message = lang === 'zh'
      ? `地址已复制：${address}`
      : `Address copied: ${address}`;
    
    bot.answerCallbackQuery(callbackQuery.id, {
      text: message,
      show_alert: true
    });
  }
});

// 错误处理
bot.on('polling_error', (error) => {
  console.error('Telegram Bot Error:', error);
});

module.exports = bot; 