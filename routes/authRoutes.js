const express = require("express");
const { login, logout } = require("../controllers/authController");
const logger = require("../middleware/logger");

const router = express.Router();

router.post("/jwt", logger, login);
router.post("/logout", logout);

module.exports = router;
