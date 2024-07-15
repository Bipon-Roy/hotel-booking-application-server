const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    roomTitle: { type: String, required: true },
    room_description: { type: String, required: true },
    room_thumbnail: { type: String, required: true },
    room_id: { type: String, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model("Bookings", BookingSchema);
