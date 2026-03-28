const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

connectDB().catch(console.error);

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use("/", require("./routes"));

module.exports = app;
