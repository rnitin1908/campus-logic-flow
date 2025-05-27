const mongoose = require('mongoose');

// MongoDB Atlas connection URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set. Please set it in your .env file');
  process.exit(1);
}

// Connect to MongoDB
async function connectToDatabase() {
  try {
    // mongoose.set('debug', true);
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas successfully');
    console.log('Database:', mongoose.connection.name);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Disconnect from MongoDB
async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

// Check if MongoDB is available
function checkMongoDBAvailability() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('MongoDB is not connected. Please ensure the connection is established.');
  }
  return true;
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  checkMongoDBAvailability,
  mongoose
};
