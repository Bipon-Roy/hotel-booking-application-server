const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://hotel-booking-60b59.web.app",
            "https://hotel-booking-60b59.firebaseapp.com",
        ],
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

const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    // console.log('token in the middleware', token);
    // no token available
    if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "unauthorized access" });
        }
        req.user = decoded;
        next();
    });
};

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const roomCollection = client.db("hotelDb").collection("hotelRooms");
        const bookingCollection = client.db("hotelDb").collection("bookings");
        const reviewCollection = client.db("hotelDb").collection("reviews");

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
            console.log(queryObj);
            if (sortOrder) {
                sortObj.price_per_night = sortOrder;
            }

            const cursor = roomCollection.find(queryObj).sort(sortObj);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/roomDetails/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await roomCollection.findOne(query);
            res.send(result);
        });
        app.get("/rooms/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };

            const options = {
                projection: {
                    _id: 1,
                    title: 1,
                    price_per_night: 1,
                    room_thumbnail: 1,
                    room_description: 1,
                    seats: 1,
                },
            };
            const result = await roomCollection.findOne(query, options);
            res.send(result);
        });
        app.patch("/rooms/:id", logger, verifyToken, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const fetchRoom = req.body;
            console.log(fetchRoom.seats);
            const updatedRoom = {
                $set: {
                    seats: fetchRoom.seats,
                },
            };

            const result = await roomCollection.updateOne(filter, updatedRoom, options);
            console.log(result);
            res.send(result);
        });
        //bookings
        app.get("/bookings", logger, verifyToken, async (req, res) => {
            console.log(req.query.email);
            console.log("Cookies:", req.user);
            if (req.user.email !== req.query.email) {
                return res.status(403).send({ message: "forbidden access" });
            }
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email };
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        });

        app.get("/bookings/:id", logger, verifyToken, async (req, res) => {
            const id = req.params.id;
            const userEmail = req.user.email;
            const query = { _id: new ObjectId(id) };
            const booking = await bookingCollection.findOne(query);
            console.log(userEmail);
            if (!booking) {
                return res.status(404).send({ message: "Booking not found" });
            }
            if (booking.email !== userEmail) {
                return res.status(403).send({ message: "Forbidden access" });
            }
            res.send(booking);
        });
        app.post("/bookings", logger, verifyToken, async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });

        app.put("/bookings/:id", logger, verifyToken, async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const fetchRoom = req.body;
            const updatedBooking = {
                $set: {
                    customerName: fetchRoom.name,
                    checkIn: fetchRoom.checkIn,
                    checkOut: fetchRoom.checkOut,
                },
            };

            const result = await bookingCollection.updateOne(filter, updatedBooking, options);
            console.log(result);
            res.send(result);
        });

        app.delete("/bookings/:id", logger, verifyToken, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        });

        //review
        app.post("/reviews", logger, verifyToken, async (req, res) => {
            const booking = req.body;
            const result = await reviewCollection.insertOne(booking);
            res.send(result);
        });

        app.get("/reviews/:id", async (req, res) => {
            const roomId = req.params.id;
            const query = { room_id: roomId };
            const cursor = reviewCollection.find(query);
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
