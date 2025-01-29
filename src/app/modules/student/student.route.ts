import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.get('/', StudentControllers.getStudents);
router.get('/:id', StudentControllers.getAStudent);
router.delete('/:id', StudentControllers.deleteAStudent);
router.patch('/:id', StudentControllers.updateAStudent);

export const StudentRoutes = router;
