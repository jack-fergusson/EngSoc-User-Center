const LocalStrategy = require('passport-local');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/User');
const passport = require("passport");
require("dotenv").config();

module.exports = function (passport) {
  // GOOGLE STRATEGY (only if credentials are provided)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.VITE_API_URL || 'http://localhost:4000'}/auth/google/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });// check if already user email is registered

          if (!user) {// if not, new user create
            user = await User.create({
              username: profile.displayName,
              googleId: profile.id,
              email: profile.emails[0].value
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    ));
    console.log("Google OAuth strategy initialized");
  } else {
    console.log("Google OAuth credentials not found - Google login disabled");
  }
  
  // LOCAL STRATEGY
  passport.use(new LocalStrategy(User.authenticate()));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};

