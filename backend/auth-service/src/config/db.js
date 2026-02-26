const mongoose = require('mongoose');
// connecting mongodb using mongoose
module.exports = async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.error("DB connection error: MONGO_URI environment variable is not set");
    console.error("Please create a .env file in backend/auth-service/ with MONGO_URI=mongodb://localhost:27017/your_database_name");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
};

