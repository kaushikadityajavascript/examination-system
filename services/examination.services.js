const Course = require("../models/Course");
const CustomError = require("../utils/customError");
const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");
const Examination = require("../models/Examination");
const User = require("../models/User");
const ExamAttempt = require("../models/ExamAttempt");

const validateQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Questions are required");
  }

  for (const [index, question] of questions.entries()) {
    const { questionText, marks, options } = question;

    if (!questionText || typeof marks !== "number") {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `Invalid question at index ${index}`
      );
    }

    if (!Array.isArray(options) || options.length < 2) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `Question at index ${index} must have at least 2 options`
      );
    }

    const correctOptions = options.filter((opt) => opt.isCorrect);
    if (correctOptions.length !== 1) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `Question at index ${index} must have exactly one correct option`
      );
    }
  }
};

const add = async (body, req) => {
  const { courseId } = req.params;
  const { name, totalMarks, passMarks, examTime, questions } = body;
  const userId = req.userId;

  const course = await Course.findOne({ _id: courseId, isDeleted: false });
  if (!course) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      `Course with id ${courseId} not found`
    );
  }

  // ✅ Validate questions structure
  validateQuestions(questions);

  const examinationData = {
    course: courseId,
    name,
    totalMarks,
    passMarks,
    examTime,
    questions,
    createdBy: new ObjectId(userId),
  };

  const createExamination = await Examination.create(examinationData);
  if (!createExamination) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Examination creation failed"
    );
  }

  return "Examination created successfully";
};

const myExams = async (req) => {
  const memberId = req.userId;

  // Get member and their assigned courses
  const member = await User.findOne({ _id: memberId, role: "member" });
  if (!member) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      `Member with id ${memberId} not found`
    );
  }

  const courseIds = member.courses;
  if (!courseIds || courseIds.length === 0) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      `Member with id ${memberId} has no assigned courses`
    );
  }

  // Get examinations under assigned courses
  const examinations = await Examination.find({
    course: { $in: courseIds },
  }).populate("course", "name description");

  if (!examinations || examinations.length === 0) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      `No examinations found for member with id ${memberId}`
    );
  }

  // Strip isCorrect field from options before returning
  const sanitizedExams = examinations.map((exam) => ({
    _id: exam._id,
    name: exam.name,
    totalMarks: exam.totalMarks,
    passMarks: exam.passMarks,
    examTime: exam.examTime,
    course: exam.course,
    questions: exam.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      marks: q.marks,
      options: q.options.map((opt) => ({
        _id: opt._id,
        optionText: opt.optionText,
      })),
    })),
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt,
  }));

  return sanitizedExams;
};

const attemptExam = async (body, req) => {
  const memberId = req.userId;
  const { examId } = req.params;
  const { answers } = req.body; // Array of selected option indices
  const member = await User.findById(memberId);
  const exam = await Examination.findById(examId);
  console.log("🚀 ~ attemptExam ~ exam:", exam);

  if (!exam) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Exam not found");
  }

  if (!member.courses.includes(String(exam.course))) {
    throw new CustomError(
      StatusCodes.FORBIDDEN,
      "You are not allowed to attempt this exam"
    );
  }

  if (!Array.isArray(answers) || answers.length !== exam.questions.length) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Answers format is invalid or incomplete"
    );
  }

  // Calculate score
  let score = 0;
  exam.questions.forEach((question, index) => {
    const selectedOptionIndex = answers[index];
    const selectedOption = question.options[selectedOptionIndex];
    console.log("selectedOption===", selectedOption);

    if (selectedOption && selectedOption.isCorrect) {
      score += question.marks;
      console.log("score===", score);
    }
  });

  const passed = score >= exam.passMarks;

  const attempt = await ExamAttempt.create({
    member: memberId,
    exam: examId,
    answers,
    score,
    passed,
  });
  if (!attempt) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Exam attempt failed"
    );
  }

  return {
    exam: exam.name,
    score,
    passed,
  };
};

module.exports = {
  add,
  myExams,
  attemptExam,
};
