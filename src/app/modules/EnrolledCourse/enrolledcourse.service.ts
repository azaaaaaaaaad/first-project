/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppError } from "../../errors/AppError"
import { OfferedCourse } from "../OfferedCourse/OfferedCourse.model"
import { TEnrolledCourse } from "./enrolledCourse.interface"
import httpStatus from 'http-status'
import EnrolledCourse from "./enrolledCourse.model"
import { StudentModel } from "../student/student.model"
import mongoose from "mongoose"
import { SemesterRegistration } from "../semisterRegistration/semisterRegistration.model"

const createEnrolledCourseIntoDB = async (userId: string, payload: TEnrolledCourse) => {
    const { offeredCourse } = payload

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, `offered course not found`)
    }

    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, `room is  full`)

    }

    const student = await StudentModel.findOne({ id: userId }).select('id')
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, `student not found`)
    }

    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        offeredCourse,
        student: student._id

    })
    if (isStudentAlreadyEnrolled) {
        throw new AppError(httpStatus.CONFLICT, `student is already enrolled`)
    }

    const enrolledCourses = await EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration: isOfferedCourseExists?.semesterRegistration,
                student: student?._id,
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourseData'
            }
        },
        {
            $unwind: '$enrolledCourseData'
        },
        {
            $group: { _id: null, totalEnrolledCredits: { $sum: "$enrolledCourseData.credits" } }
        }, {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1
            }
        }
    ])



    const semesterRegistration = await SemesterRegistration.findById(isOfferedCourseExists?.semesterRegistration).select('maxCredit')


    const session = await mongoose.startSession()

    try {
        session.startTransaction()


        const result = EnrolledCourse.create([{
            semesterRegistration: isOfferedCourseExists?.semesterRegistration,
            academicSemester: isOfferedCourseExists?.academicSemester,
            academicFaculty: isOfferedCourseExists?.academicFaculty,
            academicDepartment: isOfferedCourseExists?.academicDepartment,
            offeredCourse: offeredCourse,
            course: isOfferedCourseExists?.course,
            student: student?._id,
            faculty: isOfferedCourseExists?.faculty,
            isEnrolled: true

        }], { session })

        if (!result) {
            throw new AppError(httpStatus.BAD_REQUEST, `failed to enroll in this course`)
        }

        const maxCapacity = isOfferedCourseExists?.maxCapacity

        await OfferedCourse.findByIdAndUpdate([offeredCourse, { maxCapacity: maxCapacity - 1 }], { session })

        await session.commitTransaction()
        await session.endSession()
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new Error(error)
    }




    return result

}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB
}