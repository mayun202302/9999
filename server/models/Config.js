const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    rentalPrice: {
        type: Number,
        required: true,
        default: 0.1
    },
    energyAmount: {
        type: Number,
        required: true,
        default: 16
    },
    maxAddresses: {
        type: Number,
        required: true,
        default: 300
    },
    minAddresses: {
        type: Number,
        required: true,
        default: 10
    },
    orderTimeout: {
        type: Number,
        required: true,
        default: 600 // 10分钟
    },
    energyTimeout: {
        type: Number,
        required: true,
        default: 600 // 10分钟
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Config', configSchema); 