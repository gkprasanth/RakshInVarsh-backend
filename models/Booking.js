const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    fromLocation: {
        type: String,
        required: true
    },
    toLocation: {
        type: String,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
