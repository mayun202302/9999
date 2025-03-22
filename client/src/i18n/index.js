import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'rentEnergy': 'Rent Energy',
      'price': 'Price',
      'energyAmount': 'Energy Amount',
      'validTime': 'Valid Time',
      'buyNow': 'Buy Now',
      'paymentAddress': 'Payment Address',
      'copyAddress': 'Copy Address',
      'orderTimeout': 'Order Timeout',
      'energyTimeout': 'Energy Timeout',
      'addressPool': 'Address Pool',
      'totalAddresses': 'Total Addresses',
      'availableAddresses': 'Available Addresses',
      'pendingAddresses': 'Pending Addresses',
      'assignedAddresses': 'Assigned Addresses',
      'addAddresses': 'Add Addresses',
      'deleteAddress': 'Delete Address',
      'settings': 'Settings',
      'language': 'Language',
      'tips': {
        'freeTransfer': 'Transfer 0.1 TRX = Free U transfer',
        'noU': 'Ignore if target address has no U or is exchange',
        'validTime': 'Energy valid for 10 minutes',
        'useOnce': 'Please transfer once and use once, cannot stack'
      },
      'telegram': {
        'title': '10-Minute Special Energy',
        'walletQuery': 'Wallet Query',
        'addressMonitor': 'Address Monitor',
        'applyProxy': 'Apply Proxy',
        'language': 'Language',
        'creatingOrder': 'Creating payment order...',
        'paymentAddress': 'Payment Address',
        'notAvailable': 'Not Available'
      }
    }
  },
  zh: {
    translation: {
      'rentEnergy': '租赁能量',
      'price': '价格',
      'energyAmount': '能量数量',
      'validTime': '有效时间',
      'buyNow': '立即购买',
      'paymentAddress': '支付地址',
      'copyAddress': '复制地址',
      'orderTimeout': '订单超时',
      'energyTimeout': '能量超时',
      'addressPool': '地址池',
      'totalAddresses': '总地址数',
      'availableAddresses': '可用地址',
      'pendingAddresses': '待处理地址',
      'assignedAddresses': '已分配地址',
      'addAddresses': '添加地址',
      'deleteAddress': '删除地址',
      'settings': '设置',
      'language': '语言',
      'tips': {
        'freeTransfer': '转0.1TRX=免费转U一笔',
        'noU': '无视对方地址无U或者交易所',
        'validTime': '能量10分钟内有效',
        'useOnce': '请转一次用一次，无法叠加使用'
      },
      'telegram': {
        'title': '10分钟特价能量',
        'walletQuery': '钱包查询',
        'addressMonitor': '地址监听',
        'applyProxy': '申请代理',
        'language': '语言选择',
        'creatingOrder': '正在创建支付订单...',
        'paymentAddress': '支付地址',
        'notAvailable': '暂未开放'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 