require('dotenv').config();
const mongoose = require('mongoose');

// Use 127.0.0.1 instead of localhost for Node.js v18+ compatibility
const mongoDB_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(mongoDB_URI);
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit process on failure
  }
}

module.exports = connectDB;
