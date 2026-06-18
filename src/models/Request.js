const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    author: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "in_progress", "fulfilled"], default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
