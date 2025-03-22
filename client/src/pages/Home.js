import React, { useState, useEffect } from 'react';
import { Card, Button, Input, message, Typography, Space, Row, Col } from 'antd';
import { CopyOutlined, TelegramOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const { Title, Text } = Typography;

const Home = () => {
  const { t } = useTranslation();
  const [paymentAddress, setPaymentAddress] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleBuyNow = async () => {
    if (!userAddress) {
      message.error(t('请输入您的TRX地址'));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/orders/create', {
        userAddress
      });

      setPaymentAddress(response.data.paymentAddress);
      setOrderId(response.data.orderId);
      message.success(t('订单创建成功'));
    } catch (error) {
      message.error(error.response?.data?.message || t('创建订单失败'));
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(paymentAddress);
    message.success(t('地址已复制'));
  };

  const openTelegram = () => {
    window.open('https://t.me/your_bot_username', '_blank');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          {t('rentEnergy')}
        </Title>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Input
            placeholder={t('请输入您的TRX地址')}
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            style={{ width: '100%' }}
          />

          {paymentAddress && (
            <Card size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>{t('paymentAddress')}:</Text>
                <Space>
                  <Text copyable={{ text: paymentAddress }}>
                    {paymentAddress}
                  </Text>
                  <Button icon={<CopyOutlined />} onClick={copyAddress}>
                    {t('copyAddress')}
                  </Button>
                </Space>
              </Space>
            </Card>
          )}

          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleBuyNow}
          >
            {t('buyNow')}
          </Button>

          <Button
            type="default"
            size="large"
            block
            icon={<TelegramOutlined />}
            onClick={openTelegram}
          >
            {t('telegram.title')}
          </Button>
        </Space>

        <div style={{ marginTop: 24 }}>
          <Title level={4}>{t('使用说明')}:</Title>
          <ul>
            <li>{t('tips.freeTransfer')}</li>
            <li>{t('tips.noU')}</li>
            <li>{t('tips.validTime')}</li>
            <li>{t('tips.useOnce')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Home; 