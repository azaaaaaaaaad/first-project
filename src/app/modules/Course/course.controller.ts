/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResonse';
import catchAsync from '../../utils/catchAsync';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses are fetched successfully',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is fetched successfully',
    data: result,
  });
});

const deleteSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await CourseServices.updateCourseIntoDB(
      id,
      req.body,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is updated successfully',
    data: result,
  });
});





const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const {faculties} = req.body
  const result = await CourseServices.assignFacultiesWithCourseIntoDB(courseId, faculties);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  });
});


export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteSingleCourse,
  updateCourse,
  assignFacultiesWithCourse
};
