// app.js or index.js

const mongoose = require('mongoose');
const { MONGO_URI } = process.env; // Load your connection string from environment variables

const connectToDatabase = async () => {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Connection error:', error.message);
      process.exit(1); // Exit the application on connection error
    }
  };

  

  module.exports = connectToDatabase
