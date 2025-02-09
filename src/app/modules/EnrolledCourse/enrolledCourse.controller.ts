import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResonse";
import { EnrolledCourseServices } from "./enrolledcourse.service";
import httpStatus from 'http-status'

const createEnrolledCourse = catchAsync(async (req, res) => {

    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Student is enrolled successfully`,
        data: result
    })

})


export const EnrolledCourseControllers = {
    createEnrolledCourse
}