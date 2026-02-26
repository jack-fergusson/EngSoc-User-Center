const express = require("express");
const router = express.Router();
const {
  register,
  login,
  netidLogin,
  netidVerifyOtp,
  check,
  logout,
} = require("../controllers/authController");
const passport = require("passport");

// CLEAN ROUTES: each endpoint calls its handler from the controller
router.post("/register", register);
router.post("/login", login);
router.post("/netid-login", netidLogin);
router.post("/netid-verify-otp", netidVerifyOtp);
router.get("/check", check);
router.post("/logout", logout);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: process.env.FRONTEND_URL || "http://localhost:3000", // your frontend home, after google authentication, user will return here // your frontend home, after google authentication, user will return here
  })
);

router.get("/ping", (req, res) => {
  res.send("pong");
});

module.exports = router;
