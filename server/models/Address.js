const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['未分配', '待支付', '已分配'],
        default: '未分配'
    },
    lastUsed: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Address', addressSchema); 