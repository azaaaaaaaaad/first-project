
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "../../errors/AppError"
import { OfferedCourse } from "../OfferedCourse/OfferedCourse.model"
import { TEnrolledCourse } from "./enrolledCourse.interface"
import httpStatus from 'http-status'
import EnrolledCourse from "./enrolledCourse.model"
import { StudentModel } from "../student/student.model"
import mongoose from "mongoose"
import { SemesterRegistration } from "../semisterRegistration/semisterRegistration.model"
import { Course } from "../Course/course.model"
import { Faculty } from "../Faculty/faculty.model"

const createEnrolledCourseIntoDB = async (userId: string, payload: TEnrolledCourse) => {
    const { offeredCourse } = payload

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, `offered course not found`)
    }



    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, `room is  full`)

    }

    const student = await StudentModel.findOne({ id: userId }, { _id: 1 })
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

    const course = await Course.findById(isOfferedCourseExists.course)

    const semesterRegestration = await SemesterRegistration.findById(isOfferedCourseExists?.semesterRegistration, { maxCredit: 1 })

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

    const totalCredits = enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0

    if (totalCredits && semesterRegestration?.maxCredit && totalCredits + course?.credits > semesterRegestration?.maxCredit) {
        throw new AppError(httpStatus.BAD_REQUEST, `u have exceeded maximum no of credits`)
    }





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
        return result
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new Error(error)
    }

}

const updateEnrolledCourseMarksIntoDB = async (facultyId: string, payload: Partial<TEnrolledCourse>) => {

    const { semesterRegistration, offeredCourse, student, courseMarks } = payload

    const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration)
    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.NOT_FOUND, `semester registration not found`)
    }

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, `offered course not found`)
    }

    const isStudentExists = await StudentModel.findById(student)
    if (!isStudentExists) {
        throw new AppError(httpStatus.NOT_FOUND, `student  not found`)
    }

    const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 })
    if (!faculty) {
        throw new AppError(httpStatus.NOT_FOUND, `faculty  not found`)
    }


    const isCourseBelongToFaculty = await EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty._id
    })
    if (!isCourseBelongToFaculty) {
        throw new AppError(httpStatus.FORBIDDEN, `you are forbidden`)
    }


    const modifiedData: Record<string, unknown> = {
        ...courseMarks
    }

    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value
        }
    }

    const result = await EnrolledCourse.findById(
        isCourseBelongToFaculty,
        modifiedData,
        {
            new: true
        }
    )

    return result




}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    updateEnrolledCourseMarksIntoDB
}