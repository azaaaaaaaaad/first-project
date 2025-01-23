import express from 'express'
import { StudentControllers } from './student.controller'

const router = express.Router()

router.post('/create-student', StudentControllers.createStudent)
router.get('/', StudentControllers.getStudents)
router.get('/:id', StudentControllers.getAStudent)

export const StudentRoutes = router