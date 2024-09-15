const Review = require("../models/Review");

const createReview = async (req, res) => {
    try {
        const review = new Review(req.body);
        const result = await review.save();
        res.send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getReviewsByRoomId = async (req, res) => {
    try {
        const roomId = req.params.id;
        const result = await Review.find({ room_id: roomId });
        res.send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createReview, getReviewsByRoomId };
