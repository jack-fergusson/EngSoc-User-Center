const User = require("../models/User");
const passport = require("passport");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Validate NetID credentials. Replace with university API call when available.
 * For now: hardcoded demo (student1 / password123).
 */
function validateNetIdCredentials(netId, password) {
  const DEMO_NETID = "student1";
  const DEMO_PASSWORD = "password123";
  return netId === DEMO_NETID && password === DEMO_PASSWORD;
}

const otpStore = new Map();
const OTP_TTL = 10 * 60 * 1000;

function twoFAEmail(netId) {
  return netId === "student1" ? "sauravq213@gmail.com" : null;
}

async function sendOtpEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@engsoc.local",
      to,
      subject: "Your login verification code",
      text: `Your code: ${otp}. Valid 10 minutes.`,
    });
  } catch (e) {
    console.log("[2FA] OTP (email failed):", otp);
  }
}

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Check if user exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Register user with PLM helper
    const user = new User({ username, email });
    await User.register(user, password);

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      console.log("Login not successful");
      return res.status(400).json({ success: false, message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ success: true, user });
    });
  })(req, res, next);
};

exports.netidLogin = async (req, res) => {
  const netId = (req.body.netId || "").trim();
  const { password } = req.body;

  if (!netId || !password) return res.status(400).json({ success: false, message: "NetID and password required" });
  if (!/^[a-zA-Z0-9]+$/.test(netId)) return res.status(400).json({ success: false, message: "NetID: letters and numbers only" });
  if (!validateNetIdCredentials(netId, password)) return res.status(400).json({ success: false, message: "Invalid NetID or password" });

  try {
    let user = await User.findOne({ netId });
    if (!user) {
      user = new User({ username: netId, email: `${netId}@netid.local`, netId });
      await User.register(user, crypto.randomBytes(24).toString("hex"));
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(netId, { otp, expiresAt: Date.now() + OTP_TTL, userId: user._id.toString() });
    await sendOtpEmail(twoFAEmail(netId) || user.email, otp);
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) console.log("[2FA] OTP:", otp);
    return res.json({ success: true, requireOtp: true });
  } catch (err) {
    console.error("NetID login:", err);
    return res.status(500).json({ success: false, message: "NetID login failed" });
  }
};

exports.netidVerifyOtp = async (req, res, next) => {
  const netId = (req.body.netId || "").trim();
  const otp = (req.body.otp || "").trim();
  const stored = otpStore.get(netId);

  if (!netId || !otp || !stored || Date.now() > stored.expiresAt || stored.otp !== otp) {
    if (stored && Date.now() > stored.expiresAt) otpStore.delete(netId);
    return res.status(400).json({ success: false, message: "Invalid or expired code" });
  }

  try {
    const user = await User.findById(stored.userId);
    otpStore.delete(netId);
    if (!user) return res.status(400).json({ success: false, message: "User not found" });
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ success: true, user });
    });
  } catch (err) {
    console.error("NetID verify OTP:", err);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};

exports.check = (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ loggedIn: true, user: req.user });
  }
  res.json({ loggedIn: false });
};
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ success: false });

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
};
