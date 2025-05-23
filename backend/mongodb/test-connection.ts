import { connectToDatabase, disconnectFromDatabase } from './connection';

async function testMongoDBConnection() {
  try {
    console.log('Testing connection to MongoDB Atlas...');
    
    // Connect to the database
    await connectToDatabase();
    
    console.log('Connection successful! MongoDB Atlas is properly configured.');
    
    // Disconnect after successful test
    await disconnectFromDatabase();
    
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
