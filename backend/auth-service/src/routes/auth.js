require('dotenv').config();
const express = require('express');
const router = express.Router();
const { register, login, check, logout } = require('../controllers/authController');
const passport = require("passport");

// CLEAN ROUTES: each endpoint calls its handler from the controller
router.post("/register", register);
router.post("/login", login);
router.get("/check", check);
router.post("/logout", logout);
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/login` : "http://localhost:5173/login",
    successRedirect: process.env.FRONTEND_URL || "http://localhost:5173" // your frontend home, after google authentication, user will return here
  })
);

module.exports = router;

