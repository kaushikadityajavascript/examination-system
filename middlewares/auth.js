const mongoose = require("mongoose"); // ✅ Add this
const ObjectId = mongoose.Types.ObjectId; // ✅ Add this
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../utils/customError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");
const Token = require("../models/Token");
const dotenv = require("dotenv");
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    const decoded = jwt.verify(token, jwtSecret);
    const { userId, email, role } = decoded;
    const query = {
      _id: new ObjectId(userId),
      email: email,
      // isDeleted: false,
    };
    const checkUser = await User.findOne(query);
    if (!checkUser) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }

    if (!userId || !email) {
      throw new CustomError(StatusCodes.FORBIDDEN, "forbidden");
    }
    const tokenQuery = {
      user: new ObjectId(checkUser._id),
      tokenType: "Auth",
      token: token,
    };

    const checkToken = await Token.findOne(tokenQuery);

    if (!checkToken) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized11");
    }
    req.userId = userId;
    req.role = role;
    req.email = email;
    next();
  } catch (error) {
    console.log("error", error);
    const find = {
      token: token,
    };
    const findToken = await Token.findOne(find);
    if (!findToken) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    await Token.deleteOne({ _id: findToken._id });
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Token has expired");
  }
});

const checkRoles = (allowedRoles = []) => {
  return catchAsync(async (req, res, next) => {
    if (!allowedRoles.includes(req.role)) {
      throw new CustomError(StatusCodes.FORBIDDEN, "Access denied");
    }
    next();
  });
};

module.exports = { authMiddleware, checkRoles };
