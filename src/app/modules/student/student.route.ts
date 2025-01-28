import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.get('/', StudentControllers.getStudents);
router.get('/:studentId', StudentControllers.getAStudent);
router.delete('/:studentId', StudentControllers.deleteAStudent);
router.patch('/:studentId', StudentControllers.updateAStudent);

export const StudentRoutes = router;
