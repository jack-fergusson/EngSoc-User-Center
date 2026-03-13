const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.Mixed,
    title: String,
    date: String,
    month: String,
    day: String,
    description: String,
    category: String,
    price: Number,
    signupLink: String,
  },
  { _id: false }
);

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    profileImageUrl: String,
    contact: {
      email: String,
      phone: String,
      address: String,
    },
    contactEmails: [String],
    customContent: String,
    upcomingEvents: [eventSchema],
    createdBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema, "clubs");
