const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    room_id: { type: String, required: true },
    review: String,
    rating: Number,
});

module.exports = mongoose.model("Reviews", ReviewSchema);
