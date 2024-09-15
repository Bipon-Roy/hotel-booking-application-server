const Booking = require("../models/Booking");

const getBookings = async (req, res) => {
    try {
        if (req.user.email !== req.query.email) {
            return res.status(403).json({ message: "Forbidden access" });
        }

        let query = {};
        if (req.query?.email) {
            query = { email: req.query.email };
        }

        const result = await Booking.find(query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getBookingById = async (req, res) => {
    try {
        const id = req.params.id;
        const userEmail = req.user.email;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.email !== userEmail) {
            return res.status(403).json({ message: "Forbidden access" });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createBooking = async (req, res) => {
    try {
        const booking = new Booking(req.body);
        const result = await booking.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateBooking = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedBooking = {
            customerName: req.body.name,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
        };

        const result = await Booking.findByIdAndUpdate(id, updatedBooking, { new: true });
        if (!result) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Booking.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getBookedDates = async (req, res) => {
    const { roomId } = req.params;

    try {
        // Fetch all bookings for the room
        const bookings = await Booking.find({ roomId });

        // Map the bookings to return only the checkIn and checkOut dates
        const bookedDates = bookings.map((booking) => ({
            start: booking.checkIn,
            end: booking.checkOut,
        }));

        return res.status(200).json(bookedDates);
    } catch (error) {
        console.error("Error fetching booked dates:", error);
        return res.status(500).json({ error: "Failed to fetch booked dates" });
    }
};

module.exports = { getBookings, getBookingById, createBooking, updateBooking, deleteBooking, getBookedDates };
