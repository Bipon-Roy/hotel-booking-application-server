const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
});

module.exports = mongoose.model("Booking", BookingSchema);
