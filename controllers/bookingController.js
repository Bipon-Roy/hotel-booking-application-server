const Booking = require("../models/Booking");

const getBookings = async (req, res) => {
    if (req.user.email !== req.query.email) {
        return res.status(403).send({ message: "forbidden access" });
    }
    let query = {};
    if (req.query?.email) {
        query = { email: req.query.email };
    }
    const result = await Booking.find(query);
    res.send(result);
};

const getBookingById = async (req, res) => {
    const id = req.params.id;
    const userEmail = req.user.email;
    const booking = await Booking.findById(id);
    if (!booking) {
        return res.status(404).send({ message: "Booking not found" });
    }
    if (booking.email !== userEmail) {
        return res.status(403).send({ message: "Forbidden access" });
    }
    res.send(booking);
};

const createBooking = async (req, res) => {
    const booking = new Booking(req.body);
    const result = await booking.save();
    res.send(result);
};

const updateBooking = async (req, res) => {
    const id = req.params.id;
    const updatedBooking = {
        customerName: req.body.name,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
    };

    const result = await Booking.findByIdAndUpdate(id, updatedBooking, { new: true });
    res.send(result);
};

const deleteBooking = async (req, res) => {
    const id = req.params.id;
    const result = await Booking.findByIdAndDelete(id);
    res.send(result);
};

module.exports = { getBookings, getBookingById, createBooking, updateBooking, deleteBooking };
