/* eslint-disable no-unused-vars */
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResonse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All students fetched successfully',
    data: result,
  });
});

const getAStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getAStudentFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student fetched successfully',
    data: result,
  });
});

const deleteAStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteAStudentFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  });
});
const updateAStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentServices.updateAStudentFromDb(id, student);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
});

export const StudentControllers = {
  getStudents,
  getAStudent,
  deleteAStudent,
  updateAStudent,
};
