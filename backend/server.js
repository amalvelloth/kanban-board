require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Card = require("./models/Card");
const app = express();


// to check the backend api
app.get("/ping", (req, res) => {
  res.send("PONG");
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/cards", require('./routes/cardRouter'));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
