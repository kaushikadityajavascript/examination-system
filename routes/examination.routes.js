const express = require("express");
const router = express.Router();
const examinationController = require("../controllers/examination.controller");
const courseController = require("../controllers/examination.controller");
const { authMiddleware, checkRoles } = require("../middlewares/auth");

router.post(
  "/courses/:courseId/examinations",
  authMiddleware,
  checkRoles(["admin"]),
  courseController.addController
);

router.get(
  "/member/my-exams",
  authMiddleware,
  checkRoles(["member"]),
  examinationController.myExamsController
);

router.post(
  "/member/examinations/:examId/attempt",
  authMiddleware,
  checkRoles(["member"]),
  examinationController.examAttemptController
);

module.exports = router;
