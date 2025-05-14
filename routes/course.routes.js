const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controllers");
const { authMiddleware, checkRoles } = require("../middlewares/auth");

router.post(
  "/",
  authMiddleware,
  checkRoles(["admin"]),
  courseController.addController
);

router.post(
  "/assign-course/:memberId",
  authMiddleware,
  checkRoles(["admin"]),
  courseController.assignCourseController
);
router.get(
  "/member/my-courses",
  authMiddleware,
  checkRoles(["member"]),
  courseController.myCoursesController
);

router.get(
  "/admin/courses",
  authMiddleware,
  checkRoles(["admin"]),
  courseController.getAllCoursesController
);

module.exports = router;
