const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    clubId: { type: String, required: true },
    groupName: { type: String, required: true },
    title: { type: String, required: true },
    date: String,
    month: String,
    day: String,
    description: String,
    category: String,
    price: { type: Number, default: 0 },
    signupLink: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema, "events");
