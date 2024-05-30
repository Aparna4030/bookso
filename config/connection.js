const mongoose = require('mongoose');
const { MONGO_URI } = process.env; 

const connectToDatabase = async () => {
    try {
      await mongoose.connect(MONGO_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
      console.log('mongo db connected')
    } catch (error) {
      process.exit(1); 
    }
  };

  

  module.exports = connectToDatabase
