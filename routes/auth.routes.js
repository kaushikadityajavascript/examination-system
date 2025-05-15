const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const { authMiddleware, checkRoles } = require("../middlewares/auth");
const { addSchema, addAdminSchema } = require("../validators/auth");

router.post("/register", addAdminSchema, authController.addController);
router.post("/login", authController.loginController);
router.post(
  "/create-member",
  addSchema,
  authMiddleware,
  checkRoles(["admin"]),
  authController.createMemberController
);

module.exports = router;
