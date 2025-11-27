require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const connectDB = require('./config/db');
const passportConfig = require('./config/passport');

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
// session middleware
app.use(session({
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));


app.use(passport.initialize());
app.use(passport.session());

// Connect DB (your Atlas connection)
connectDB();

// Passport config
passportConfig(passport);

// Routes
app.use('/auth', require('./routes/auth'));

// Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
