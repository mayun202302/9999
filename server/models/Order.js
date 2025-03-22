const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    paymentAddress: {
        type: String,
        required: true
    },
    userAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['待支付', '已支付', '已完成', '已取消'],
        default: '待支付'
    },
    amount: {
        type: Number,
        required: true,
        default: 0.1
    },
    energyAmount: {
        type: Number,
        required: true,
        default: 16
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    },
    paymentReceived: {
        type: Boolean,
        default: false
    },
    energyTransferred: {
        type: Boolean,
        default: false
    },
    energyRecovered: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Order', orderSchema); 