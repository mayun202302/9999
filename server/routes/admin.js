const express = require('express');
const router = express.Router();
const Config = require('../models/Config');
const Address = require('../models/Address');

// 获取系统配置
router.get('/config', async (req, res) => {
    try {
        const config = await Config.findOne();
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 更新系统配置
router.put('/config', async (req, res) => {
    try {
        const {
            rentalPrice,
            energyAmount,
            maxAddresses,
            minAddresses,
            orderTimeout,
            energyTimeout
        } = req.body;

        const config = await Config.findOne();
        if (!config) {
            const newConfig = new Config({
                rentalPrice,
                energyAmount,
                maxAddresses,
                minAddresses,
                orderTimeout,
                energyTimeout
            });
            await newConfig.save();
            return res.json(newConfig);
        }

        config.rentalPrice = rentalPrice;
        config.energyAmount = energyAmount;
        config.maxAddresses = maxAddresses;
        config.minAddresses = minAddresses;
        config.orderTimeout = orderTimeout;
        config.energyTimeout = energyTimeout;
        config.lastUpdated = new Date();

        await config.save();
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 获取地址池统计
router.get('/addresses/stats', async (req, res) => {
    try {
        const total = await Address.countDocuments();
        const available = await Address.countDocuments({ status: '未分配' });
        const pending = await Address.countDocuments({ status: '待支付' });
        const assigned = await Address.countDocuments({ status: '已分配' });

        res.json({
            total,
            available,
            pending,
            assigned
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 批量添加地址
router.post('/addresses/batch', async (req, res) => {
    try {
        const { addresses } = req.body;
        const config = await Config.findOne();
        
        // 检查地址数量限制
        const currentCount = await Address.countDocuments();
        if (currentCount + addresses.length > config.maxAddresses) {
            return res.status(400).json({ 
                message: `地址数量超过最大限制 ${config.maxAddresses}` 
            });
        }

        const addressDocs = addresses.map(addr => ({
            address: addr,
            status: '未分配'
        }));

        await Address.insertMany(addressDocs);
        res.json({ message: '地址添加成功' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 删除地址
router.delete('/addresses/:address', async (req, res) => {
    try {
        const config = await Config.findOne();
        const currentCount = await Address.countDocuments();
        
        if (currentCount <= config.minAddresses) {
            return res.status(400).json({ 
                message: `地址数量不能低于最小限制 ${config.minAddresses}` 
            });
        }

        await Address.findOneAndDelete({ address: req.params.address });
        res.json({ message: '地址删除成功' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 