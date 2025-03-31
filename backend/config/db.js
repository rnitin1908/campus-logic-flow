// This file is now just a placeholder since we've moved to Supabase
// We keep it to avoid breaking imports until we can fully migrate
// the backend code to use Supabase functions

const connectDB = async () => {
  console.log('Using Supabase instead of MongoDB');
  return true;
};

module.exports = connectDB;
