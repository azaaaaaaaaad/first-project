import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResonse";
import { EnrolledCourseServices } from "./enrolledcourse.service";
import httpStatus from 'http-status'

const createEnrolledCourse = catchAsync(async (req, res) => {

    const userId = req.user.userId
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(userId, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Student is enrolled successfully`,
        data: result
    })

})

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {

    const facultyId = req.user.id

    const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(facultyId, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Marks are updated successfully`,
        data: result
    })
})


export const EnrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks
}