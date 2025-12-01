const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.json({ message: "Logged in successfully" });
});

router.get("/ping", (req, res) => {
  res.send("pong");
});

module.exports = router;
