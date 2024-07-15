const express = require("express");
const { createReview, getReviewsByRoomId } = require("../controllers/reviewController");
const verifyToken = require("../middleware/authMiddleware");
const logger = require("../middleware/logger");

const router = express.Router();

router.post("/", logger, verifyToken, createReview);
router.get("/:id", getReviewsByRoomId);

module.exports = router;
