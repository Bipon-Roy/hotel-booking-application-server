const express = require("express");
const {
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookedDates,
} = require("../controllers/bookingController");
const verifyToken = require("../middleware/authMiddleWare");
const logger = require("../middleware/logger");

const router = express.Router();

router.get("/", logger, verifyToken, getBookings);
router.get("/:id", logger, verifyToken, getBookingById);
router.post("/", logger, verifyToken, createBooking);
router.put("/:id", logger, verifyToken, updateBooking);
router.delete("/:id", logger, verifyToken, deleteBooking);
router.get("/:id/booked-dates", logger, verifyToken, getBookedDates);

module.exports = router;
