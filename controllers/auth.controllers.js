const catchAsync = require("../utils/catchAsync");
const { setSuccessResponse } = require("../utils/sendResponse");
const { StatusCodes } = require("http-status-codes");
const SERVICE = require("../services/auth.services");

const addController = catchAsync(async (req, res) => {
  const addNew = await SERVICE.add(req.body, req);
  if (addNew) {
    return setSuccessResponse(
      res,
      StatusCodes.CREATED,
      true,
      "User created successfully",
      addNew
    );
  }
});

const loginController = catchAsync(async (req, res) => {
  const login = await SERVICE.login(req.body, req);
  if (login) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      login,
      "logged in successfully"
    );
  }
});

const createMemberController = catchAsync(async (req, res) => {
  const createMember = await SERVICE.createMember(req.body, req);
  if (createMember) {
    return setSuccessResponse(
      res,
      StatusCodes.CREATED,
      true,
      "Member created successfully",
      createMember
    );
  }
});

module.exports = { addController, loginController, createMemberController };
