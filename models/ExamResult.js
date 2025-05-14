// models/ExamResult.js
const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionIndex: Number,
    selectedOptionIndex: Number,
  },
  { _id: false }
);

const examResultSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    answers: [answerSchema],
    obtainedMarks: { type: Number },
    passed: { type: Boolean },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamResult", examResultSchema);
