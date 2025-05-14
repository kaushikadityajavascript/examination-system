const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  optionText: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  marks: { type: Number, required: true },
  options: { type: [OptionSchema], validate: (v) => v.length >= 2 },
});

const ExaminationSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    name: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    passMarks: { type: Number, required: true },
    examTime: { type: Number, required: true }, // in minutes
    questions: { type: [QuestionSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Examination", ExaminationSchema);
