const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    review: String,
    rating: Number,
});

module.exports = mongoose.model("Review", ReviewSchema);
