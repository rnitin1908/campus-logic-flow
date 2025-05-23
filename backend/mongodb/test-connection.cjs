const mongoose = require('mongoose');

// MongoDB Atlas connection URI
const MONGODB_URI = 'mongodb+srv://educore_admin:TyMYHKk53MD2oTMp@educore.bxsujod.mongodb.net/?retryWrites=true&w=majority&appName=Educore';

async function testMongoDBConnection() {
  try {
    console.log('Testing connection to MongoDB Atlas...');
    
    // Connect to the database
    await mongoose.connect(MONGODB_URI);
    
    console.log('Connection successful! MongoDB Atlas is properly configured.');
    console.log('Connected to database:', mongoose.connection.name);
    
    // Disconnect after successful test
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
    
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

// Run the test
testMongoDBConnection()
  .then((success) => {
    console.log(`Connection test ${success ? 'passed' : 'failed'}`);
    
    // Exit process with appropriate code
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error during connection test:', error);
    process.exit(1);
  });
