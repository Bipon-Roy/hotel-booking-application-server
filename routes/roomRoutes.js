const express = require("express");
const {
    getRooms,
    getRoomById,
    getRoomDetails,
    updateRoom,
} = require("../controllers/roomController");
const verifyToken = require("../middleware/authMiddleware");
const logger = require("../middleware/logger");

const router = express.Router();

router.get("/", getRooms);
router.get("/details/:id", getRoomById);
router.get("/:id", getRoomDetails);
router.patch("/:id", logger, verifyToken, updateRoom);

module.exports = router;
