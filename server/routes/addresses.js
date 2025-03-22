const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    fullHost: process.env.TRON_FULL_NODE,
    privateKey: process.env.ADDRESS_B_PRIVATE_KEY,
    headers: { "TRON-PRO-API-KEY": process.env.TRONSTACK_API_KEY }
});

// 获取可用地址
router.get('/available', async (req, res) => {
    try {
        const address = await Address.findOne({ status: '未分配' });
        if (!address) {
            return res.status(404).json({ message: '没有可用地址' });
        }
        address.status = '待支付';
        await address.save();
        res.json({ address: address.address });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 释放地址
router.post('/release/:address', async (req, res) => {
    try {
        const address = await Address.findOne({ address: req.params.address });
        if (!address) {
            return res.status(404).json({ message: '地址不存在' });
        }
        address.status = '未分配';
        await address.save();
        res.json({ message: '地址已释放' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 批量添加地址（管理员）
router.post('/batch', async (req, res) => {
    try {
        const { addresses } = req.body;
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

// 获取地址列表（管理员）
router.get('/list', async (req, res) => {
    try {
        const addresses = await Address.find();
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 删除地址（管理员）
router.delete('/:address', async (req, res) => {
    try {
        await Address.findOneAndDelete({ address: req.params.address });
        res.json({ message: '地址删除成功' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 