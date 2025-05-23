import mongoose from 'mongoose';

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://educore_admin:TyMYHKk53MD2oTMp@educore.bxsujod.mongodb.net/?retryWrites=true&w=majority&appName=Educore';

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Disconnect from MongoDB
export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

// Check if MongoDB is available
export function checkMongoDBAvailability() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('MongoDB is not connected. Please ensure the connection is established.');
  }
}

export default mongoose;
