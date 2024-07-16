const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    timestamp: { type: String, required: true },
    userPhoto: { type: String, required: true },
    room_id: { type: String, required: true },
});

module.exports = mongoose.model("Reviews", ReviewSchema);
