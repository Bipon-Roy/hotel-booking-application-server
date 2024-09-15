const jwt = require("jsonwebtoken");

const login = (req, res) => {
    try {
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: false,
            secure: true,
            sameSite: "none",
        }).send({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie("token", { maxAge: 0 }).send({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { login, logout };
