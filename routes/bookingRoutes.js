const express = require('express');
const { bookUmbrella, getBookings } = require('../controllers/bookingController');
const router = express.Router();

// Routes for booking
router.post('/book', bookUmbrella);  
router.get('/bookings', getBookings);  

module.exports = router;
