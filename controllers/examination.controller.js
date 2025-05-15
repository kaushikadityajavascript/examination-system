const catchAsync = require("../utils/catchAsync");
const { setSuccessResponse } = require("../utils/sendResponse");
const { StatusCodes } = require("http-status-codes");
const SERVICE = require("../services/examination.services");

const addController = catchAsync(async (req, res) => {
  const addNew = await SERVICE.add(req.body, req);
  if (addNew) {
    return setSuccessResponse(
      res,
      StatusCodes.CREATED,
      true,
      "Exam created successfully",
      addNew
    );
  }
});

const myExamsController = catchAsync(async (req, res) => {
  const myExams = await SERVICE.myExams(req);
  if (myExams) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "My exams fetched successfully",
      myExams
    );
  }
});

const examAttemptController = catchAsync(async (req, res) => {
  const examAttempt = await SERVICE.attemptExam(req.body, req);
  if (examAttempt) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Exam attempted successfully",
      examAttempt
    );
  }
});

const viewResultsController = catchAsync(async (req, res) => {
  const viewResults = await SERVICE.viewResults(req);
  if (viewResults) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Exam results fetched successfully",
      viewResults
    );
  }
});

module.exports = {
  addController,
  myExamsController,
  examAttemptController,
  viewResultsController,
};
