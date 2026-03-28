const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    clubId: { type: String, required: true },
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, clubId: 1 }, { unique: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
