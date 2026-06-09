const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const sentimentRoutes = require("./routes/sentimentRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/sentiment", sentimentRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "FinSight API Running",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});