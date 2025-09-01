// controllers/bookingController.js
const Booking = require('../models/booking');
const ParkingSpace = require('../models/parkingSpace');

// Create a new booking
exports.createBooking = async (req, res) => {
    const { parkingSpaceId, startTime, endTime } = req.body;
    try {
        const parkingSpace = await ParkingSpace.findById(parkingSpaceId);
        if (!parkingSpace) {
            return res.status(404).json({ msg: 'Parking space not found' });
        }
        // Simplified availability check: in a real-world app, this would be more complex
        // and involve transactions to prevent double-booking.
        // For this example, we'll assume the search query handled availability.

        const newBooking = new Booking({
            guest: req.user.id, // Comes from auth middleware
            parkingSpace: parkingSpaceId,
            startTime,
            endTime,
            totalPrice: parkingSpace.price * ((new Date(endTime) - new Date(startTime)) / 3600000), // Price per hour
        });
        await newBooking.save();
        res.status(201).json({ msg: 'Booking successful', bookingId: newBooking.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get a user's booking history
exports.getBookingHistory = async (req, res) => {
    try {
        const bookings = await Booking.find({ guest: req.user.id }).populate('parkingSpace');
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};