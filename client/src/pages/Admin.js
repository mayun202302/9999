import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Form, Modal, message, Space, Row, Col, Statistic } from 'antd';
import { PlusOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Admin = () => {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState([]);
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState(null);
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [isAddAddressModalVisible, setIsAddAddressModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [addressesRes, configRes, statsRes] = await Promise.all([
        axios.get('/api/addresses/list'),
        axios.get('/api/admin/config'),
        axios.get('/api/admin/addresses/stats')
      ]);

      setAddresses(addressesRes.data);
      setConfig(configRes.data);
      setStats(statsRes.data);
    } catch (error) {
      message.error(t('获取数据失败'));
    }
  };

  const handleConfigSubmit = async (values) => {
    try {
      await axios.put('/api/admin/config', values);
      message.success(t('配置更新成功'));
      setIsConfigModalVisible(false);
      fetchData();
    } catch (error) {
      message.error(t('配置更新失败'));
    }
  };

  const handleAddAddresses = async (values) => {
    try {
      const addresses = values.addresses.split('\n').map(addr => addr.trim()).filter(addr => addr);
      await axios.post('/api/admin/addresses/batch', { addresses });
      message.success(t('地址添加成功'));
      setIsAddAddressModalVisible(false);
      addressForm.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || t('地址添加失败'));
    }
  };

  const handleDeleteAddress = async (address) => {
    try {
      await axios.delete(`/api/admin/addresses/${address}`);
      message.success(t('地址删除成功'));
      fetchData();
    } catch (error) {
      message.error(t('地址删除失败'));
    }
  };

  const columns = [
    {
      title: t('address'),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('lastUsed'),
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: t('action'),
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteAddress(record.address)}
        >
          {t('delete')}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('totalAddresses')}
              value={stats?.total}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('availableAddresses')}
              value={stats?.available}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('pendingAddresses')}
              value={stats?.pending}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('assignedAddresses')}
              value={stats?.assigned}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={t('addressPool')}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddAddressModalVisible(true)}
            >
              {t('addAddresses')}
            </Button>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setIsConfigModalVisible(true)}
            >
              {t('settings')}
            </Button>
          </Space>
        }
        style={{ marginTop: 16 }}
      >
        <Table
          columns={columns}
          dataSource={addresses}
          rowKey="address"
          pagination={false}
        />
      </Card>

      <Modal
        title={t('settings')}
        visible={isConfigModalVisible}
        onCancel={() => setIsConfigModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={config}
          onFinish={handleConfigSubmit}
        >
          <Form.Item
            name="rentalPrice"
            label={t('price')}
            rules={[{ required: true }]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>
          <Form.Item
            name="energyAmount"
            label={t('energyAmount')}
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="maxAddresses"
            label={t('maxAddresses')}
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="minAddresses"
            label={t('minAddresses')}
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t('save')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t('addAddresses')}
        visible={isAddAddressModalVisible}
        onCancel={() => setIsAddAddressModalVisible(false)}
        footer={null}
      >
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={handleAddAddresses}
        >
          <Form.Item
            name="addresses"
            label={t('addresses')}
            rules={[{ required: true }]}
            extra={t('每行一个地址')}
          >
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t('submit')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin; 