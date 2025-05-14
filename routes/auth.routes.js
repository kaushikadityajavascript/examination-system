const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const { authMiddleware, checkRoles } = require("../middlewares/auth");

router.post("/register", authController.addController);
router.post("/login", authController.loginController);
router.post(
  "/create-member",
  authMiddleware,
  checkRoles(["admin"]),
  authController.createMemberController
);

module.exports = router;
