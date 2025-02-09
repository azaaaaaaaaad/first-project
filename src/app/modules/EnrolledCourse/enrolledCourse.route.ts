import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { EnrolledCourseValidations } from './enrolledCourse.validations'
import { EnrolledCourseControllers } from './enrolledCourse.controller'

const router = express.Router()


router.post(
    '/create-enrolled-course',
    validateRequest(
        EnrolledCourseValidations.createEnrolledCourseValidationSchema),
    EnrolledCourseControllers.createEnrolledCourse)


export const EnrolledCourseRoutes = router