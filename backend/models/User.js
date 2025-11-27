const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String},
  email:    { type: String, required: true, unique: true },
  googleId: { type: String }, // <--  for Google OAuth users
});

// This automatically adds hashing + salting + methods like register(), authenticate()
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'    // makes email the login field
  // already includes password by default
});

module.exports = mongoose.model('User', userSchema);
