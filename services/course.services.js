const Course = require("../models/Course");
const User = require("../models/User");
const CustomError = require("../utils/customError");
const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");

const add = async (body, req) => {
  const { name, description } = body;
  const userId = req.userId;
  const courseData = {
    name,
    description,
    createdBy: new ObjectId(userId),
  };
  const createCourse = await Course.create(courseData);
  if (!createCourse) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Course creation failed"
    );
  }
  return createCourse;
};

const assignCourse = async (body, req) => {
  const { memberId } = req.params;
  const { courseId } = body;
  const userId = req.userId;
  const member = await User.findOne({ _id: memberId, role: "member" });
  if (!member) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      `Member with id ${memberId} not found`
    );
  }
  const course = await Course.findOne({ _id: courseId, isDeleted: false });
  if (!course) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      `Course with id ${courseId} not found`
    );
  }
  // prevent duplicate assignment
  if (member.courses.includes(courseId)) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      `Course with id ${courseId} already assigned to member with id ${memberId}`
    );
  }
  const updatedMember = await User.findByIdAndUpdate(
    memberId,
    { $addToSet: { courses: courseId } },
    { new: true }
  );
  if (!updatedMember) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to assign course to member"
    );
  }
  return {
    message: "Course assigned successfully",
    memberId: updatedMember._id,
    courseId: course._id,
  };
};

const myCourses = async (req) => {
  const userId = req.userId;
  const member = await User.findById(userId).populate("courses");
  if (!member) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      `Member with id ${userId} not found`
    );
  }
  const courses = member.courses;
  if (!courses || courses.length === 0) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      `No courses found for member with id ${userId}`
    );
  }
  const courseObj = courses.toObject();
  delete courseObj.isDeleted;
  delete courseObj.createdBy;
  delete courseObj.__v;
  delete courseObj.createdAt;
  delete courseObj.updatedAt;
  delete courseObj.assignedTo;
  return courses;
};

const getAllCourses = async (req, res) => {
  const courses = await Course.find({ isDeleted: false }).populate(
    "name description"
  );
  if (!courses || courses.length === 0) {
    throw new CustomError(StatusCodes.NOT_FOUND, "No courses found");
  }
  return courses;
};

module.exports = {
  add,
  assignCourse,
  myCourses,
  getAllCourses,
};
