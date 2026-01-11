const mongoose = require('mongoose');
// connecting mongodb using mongoose
module.exports = async function connectDB() {
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
