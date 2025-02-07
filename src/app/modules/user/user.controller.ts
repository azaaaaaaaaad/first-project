/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserServices } from './user.service';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResonse';
import catchAsync from '../../utils/catchAsync';
import { AppError } from '../../errors/AppError';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await UserServices.createStudentIntoDB(password, studentData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;
  const result = await UserServices.createFacultyIntoDB(password, facultyData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});


const getMe = catchAsync(async (req, res) => {

  const token = req.headers.authorization
  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, 'access token not found')
  }

  const result = await UserServices.getMe(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get me succesfully',
    data: result,
  });
});


export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe
};
