const Booking = require('../models/Booking');

// Book umbrella
exports.bookUmbrella = async (req, res) => {
    const { fromLocation, toLocation, hours } = req.body;
    const amount = hours * 30;  // Calculate cost based on hours (₹30 per hour)
    
    try {
        const booking = new Booking({
            fromLocation,
            toLocation,
            hours,
            amount
        });
        await booking.save();
        res.status(201).json({ message: "Umbrella booked successfully", booking });
    } catch (error) {
        res.status(500).json({ message: "Error booking umbrella", error });
    }
};

// Get all bookings
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};
