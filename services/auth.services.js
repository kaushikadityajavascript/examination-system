const User = require("../models/User");
const CustomError = require("../utils/customError");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const Token = require("../models/Token");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

// Admin user registration
const add = async (body, req) => {
  const { email, password, secret } = body;
  if (secret !== process.env.ADMIN_SECRET) {
    throw new CustomError(
      StatusCodes.UNAUTHORIZED,
      "Unauthorized to register as admin"
    );
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError(StatusCodes.CONFLICT, "User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  body.password = hashedPassword;
  body.role = "admin";
  const userData = { ...body };
  const createUser = await User.create(userData);
  if (!createUser) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "User creation failed"
    );
  }
  const user = createUser.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

const login = async (body, req) => {
  const { email, password } = body;
  const checkUser = await User.findOne({ email });
  if (!checkUser) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "User not exists");
  }
  const isPasswordValid = await bcrypt.compare(password, checkUser.password);
  if (!isPasswordValid) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Invalid email or password");
  }
  const accessToken = jwt.sign(
    {
      userId: checkUser._id,
      email: checkUser.email,
      role: checkUser.role,
    },
    jwtSecret,
    {
      expiresIn: "2h",
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: checkUser._id,
      email: checkUser.email,
      role: checkUser.role,
    },
    jwtSecret,
    {
      expiresIn: "8h",
    }
  );
  if (!accessToken) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Token expired");
  }

  const loginJson = {
    id: checkUser._id,
    name: checkUser.name,
    email: checkUser.email,
    token: accessToken,
    refreshToken,
    role: checkUser.role,
  };

  const tokenRows = [
    {
      user: checkUser._id,
      tokenType: "Auth",
      token: accessToken,
    },
    {
      user: checkUser._id,
      tokenType: "RefreshAuth",
      token: refreshToken,
    },
  ];
  const createTokenRecords = await Token.insertMany(tokenRows);
  if (!createTokenRecords) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem occured!"
    );
  }
  return loginJson;
};

const createMember = async (body, req) => {
  const { name, email, phone, gender, password } = body;
  const existingMember = await User.findOne({ email });
  if (existingMember) {
    throw new CustomError(StatusCodes.CONFLICT, "Member already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const memberData = {
    name,
    email,
    phone,
    gender,
    password: hashedPassword,
    role: "member",
  };
  const createMember = await User.create(memberData);
  if (!createMember) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Member creation failed"
    );
  }
  const member = createMember.toObject();
  delete member.password;
  delete member.__v;
  return member;
};

module.exports = {
  add,
  login,
  createMember,
};
