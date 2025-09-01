const mongoose = require('mongoose');
const parkingSpaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    availability: [{
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
parkingSpaceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('parkingSpace', parkingSpaceSchema);