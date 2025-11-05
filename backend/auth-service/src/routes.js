import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  res.json({ message: "Logged in successfully" });
});

router.get("/ping", (req, res) => {
  res.json({ message: "Auth service is alive!" });
});

export default router;
