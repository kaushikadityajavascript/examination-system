const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    tokenType: {
      type: String,
      enum: ["Auth", "RefreshAuth", "Reset"],
      default: "Auth",
    },
  },
  { timestamps: true }
);

const Tokens = mongoose.model("Token", tokenSchema);

module.exports = Tokens;
