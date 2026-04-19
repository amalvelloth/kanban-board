const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: String,
  column: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
