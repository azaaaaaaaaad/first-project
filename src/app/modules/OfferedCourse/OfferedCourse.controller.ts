import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResonse';
import httpStatus from 'http-status';
import { OfferedCourseServices } from './OfferedCourse.service';
import { Request, Response } from 'express';

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is created successfully !',
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
};
