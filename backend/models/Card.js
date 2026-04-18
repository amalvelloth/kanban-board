const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: String,
  column: String,  // Added for drag-and-drop functionality
  // Add any other fields you need here
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
