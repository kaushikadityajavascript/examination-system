const catchAsync = require("../utils/catchAsync");
const { setSuccessResponse } = require("../utils/sendResponse");
const { StatusCodes } = require("http-status-codes");
const SERVICE = require("../services/course.services");

const addController = catchAsync(async (req, res) => {
  const addNew = await SERVICE.add(req.body, req);
  if (addNew) {
    return setSuccessResponse(
      res,
      StatusCodes.CREATED,
      true,
      "Course created successfully",
      addNew
    );
  }
});

const assignCourseController = catchAsync(async (req, res) => {
  const assignCourse = await SERVICE.assignCourse(req.body, req);
  if (assignCourse) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Course assigned successfully",
      assignCourse
    );
  }
});

const myCoursesController = catchAsync(async (req, res) => {
  const myCourses = await SERVICE.myCourses(req);
  if (myCourses) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "My courses fetched successfully",
      myCourses
    );
  }
});

const getAllCoursesController = catchAsync(async (req, res) => {
  const allCourses = await SERVICE.getAllCourses(req);
  if (allCourses) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "All courses fetched successfully",
      allCourses
    );
  }
});

module.exports = {
  addController,
  assignCourseController,
  myCoursesController,
  getAllCoursesController,
};
