const jwt = require("jsonwebtoken");

const login = (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
    }).send({ success: true });
};

const logout = (req, res) => {
    res.clearCookie("token", { maxAge: 0 }).send({ success: true });
};

module.exports = { login, logout };
