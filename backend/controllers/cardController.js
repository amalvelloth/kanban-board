
const Card = require("../models/Card");

// Get all cards
const getAllCards = async (req, res) => { 
  try {
    const cards = await Card.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ cards }); // Wrap in object for consistent response format
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get a card by ID
const getCardById = async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new card
const addCard = async (req, res) => {
  try {
    if (!req.body.title || !req.body.column) {
      return res.status(400).json({ error: "Title and column are required" });
    }

    const newCard = await Card.create({
      title: req.body.title,
      column: req.body.column,
      userId: req.user._id
    });

    // Fetch all cards after adding new one
    const cards = await Card.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(201).json({ cards }); // Wrap in object for consistent response format
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(400).json({ error: error.message });
  }
};

const updateCardColumn = async (req, res) => {
  try {
    const { _id, title, column } = req.body; // Directly access properties

    // console.log("Request Body:", req.body);

    if (!_id) {
      return res.status(400).json({ error: "Card ID is required" });
    }

    const updatedCard = await Card.findOneAndUpdate(
      { _id, userId: req.user._id },
      { column, title },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ error: "Card not found or unauthorized" });
    }

    // console.log("Updated Card:", updatedCard);

    // Fetch updated list of cards
    const allCards = await Card.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ cards: allCards });
  } catch (error) {
    console.error("Error updating cards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCard = await Card.findOneAndDelete({ _id: id, userId: req.user._id });
    
    if (!deletedCard) {
      return res.status(404).json({ error: "Card not found or unauthorized" });
    }
    
    // Fetch all remaining cards after deletion
    const cards = await Card.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ cards }); // Return remaining cards instead of just a message
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCards,
  getCardById,
  addCard,
  updateCardColumn,
  deleteCard
};