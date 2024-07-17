const Review = require("../models/Review");

const createReview = async (req, res) => {
    const review = new Review(req.body);
    const result = await review.save();
    res.send(result);
};

const getReviewsByRoomId = async (req, res) => {
    const roomId = req.params.id;
    const result = await Review.find({ room_id: roomId });
    res.send(result);
};

module.exports = { createReview, getReviewsByRoomId };
