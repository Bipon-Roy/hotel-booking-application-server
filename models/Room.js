const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    title: String,
    price_per_night: Number,
    room_thumbnail: String,
    room_description: String,
    seats: Number,
});

module.exports = mongoose.model("Rooms", RoomSchema);
