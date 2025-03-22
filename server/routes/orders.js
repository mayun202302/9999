const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Address = require('../models/Address');
const Config = require('../models/Config');
const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    fullHost: process.env.TRON_FULL_NODE,
    privateKey: process.env.ADDRESS_B_PRIVATE_KEY,
    headers: { "TRON-PRO-API-KEY": process.env.TRONSTACK_API_KEY }
});

// 创建订单
router.post('/create', async (req, res) => {
    try {
        const { userAddress } = req.body;
        const config = await Config.findOne();
        
        // 检查用户地址是否已有能量
        const account = await tronWeb.trx.getAccount(userAddress);
        if (account && account.data && account.data.length > 0) {
            return res.status(400).json({ 
                message: '购买失败，您的账户已有能量，请使用后在下单' 
            });
        }

        // 获取支付地址
        const paymentAddress = await Address.findOne({ status: '未分配' });
        if (!paymentAddress) {
            return res.status(404).json({ message: '系统繁忙，请稍后重试' });
        }

        // 创建订单
        const order = new Order({
            orderId: tronWeb.sha3(Date.now().toString()).substring(0, 32),
            paymentAddress: paymentAddress.address,
            userAddress,
            amount: config.rentalPrice,
            energyAmount: config.energyAmount,
            expiresAt: new Date(Date.now() + config.orderTimeout * 1000)
        });

        await order.save();
        paymentAddress.status = '待支付';
        await paymentAddress.save();

        res.json({
            orderId: order.orderId,
            paymentAddress: order.paymentAddress,
            amount: order.amount,
            expiresAt: order.expiresAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 检查订单状态
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) {
            return res.status(404).json({ message: '订单不存在' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 处理支付成功
router.post('/:orderId/payment', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) {
            return res.status(404).json({ message: '订单不存在' });
        }

        if (order.status !== '待支付') {
            return res.status(400).json({ message: '订单状态错误' });
        }

        order.status = '已支付';
        order.paymentReceived = true;
        await order.save();

        // 转移能量
        try {
            await tronWeb.trx.delegateResource(
                order.energyAmount,
                order.userAddress,
                'ENERGY',
                true
            );
            order.energyTransferred = true;
            await order.save();

            // 设置定时任务回收能量
            setTimeout(async () => {
                try {
                    await tronWeb.trx.undelegateResource(
                        order.energyAmount,
                        order.userAddress,
                        'ENERGY',
                        true
                    );
                    order.energyRecovered = true;
                    order.status = '已完成';
                    await order.save();
                } catch (error) {
                    console.error('能量回收失败:', error);
                }
            }, 600000); // 10分钟后回收
        } catch (error) {
            console.error('能量转移失败:', error);
            return res.status(500).json({ message: '能量转移失败' });
        }

        res.json({ message: '能量已成功转移到您的地址' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 取消订单
router.post('/:orderId/cancel', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) {
            return res.status(404).json({ message: '订单不存在' });
        }

        if (order.status !== '待支付') {
            return res.status(400).json({ message: '订单状态错误' });
        }

        order.status = '已取消';
        await order.save();

        // 释放支付地址
        const address = await Address.findOne({ address: order.paymentAddress });
        if (address) {
            address.status = '未分配';
            await address.save();
        }

        res.json({ message: '订单已取消' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 