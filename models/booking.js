const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    parkingSpace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parkingSpace',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('booking', bookingSchema);