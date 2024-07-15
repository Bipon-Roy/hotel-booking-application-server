const Room = require("../models/room");

const getRooms = async (req, res) => {
    const queryObj = {};
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const sortOrder = req.query.sortOrder;
    const sortObj = {};

    if (!isNaN(minPrice)) {
        queryObj.price_per_night = { $gte: minPrice };
    }
    if (!isNaN(maxPrice)) {
        if (queryObj.price_per_night) {
            queryObj.price_per_night.$lte = maxPrice;
        } else {
            queryObj.price_per_night = { $lte: maxPrice };
        }
    }
    if (sortOrder) {
        sortObj.price_per_night = sortOrder;
    }

    const result = await Room.find(queryObj).sort(sortObj);
    res.send(result);
};

const getRoomById = async (req, res) => {
    const id = req.params.id;
    const result = await Room.findById(id);
    res.send(result);
};

const getRoomDetails = async (req, res) => {
    const id = req.params.id;
    const result = await Room.findById(id, {
        _id: 1,
        title: 1,
        price_per_night: 1,
        room_thumbnail: 1,
        room_description: 1,
        seats: 1,
    });
    res.send(result);
};

const updateRoom = async (req, res) => {
    const id = req.params.id;
    const updatedRoom = {
        seats: req.body.seats,
    };

    const result = await Room.findByIdAndUpdate(id, updatedRoom, { new: true });
    res.send(result);
};

module.exports = { getRooms, getRoomById, getRoomDetails, updateRoom };
