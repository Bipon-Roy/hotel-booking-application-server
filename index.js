const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// middleware
app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.sw3jgjt.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

const logger = (req, res, next) => {
    console.log("log: info", req.method, req.url);
    next();
};

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const roomCollection = client.db("hotelDb").collection("rooms");
        //auth related api
        app.post("/jwt", logger, async (req, res) => {
            const user = req.body;
            console.log("user token", user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            res.cookie("token", token, {
                httpOnly: false,
                secure: true,
                sameSite: "none",
                // secure: process.env.NODE_ENV === "production",
                // sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            }).send({ success: true });
        });
        app.post("/logout", async (req, res) => {
            const user = req.body;
            console.log("logging out", user);
            res.clearCookie("token", { maxAge: 0 }).send({ success: true });
        });

        //Hotels related api
        app.get("/rooms", async (req, res) => {
            const cursor = roomCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log(`Assignment 11 Server ${port}`);
});
