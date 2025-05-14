const mongoose = require("mongoose");

const examAttemptSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Examination",
    required: true,
  },
  answers: [Number], // index-based answers
  score: Number,
  passed: Boolean,
  attemptedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExamAttempt", examAttemptSchema);
