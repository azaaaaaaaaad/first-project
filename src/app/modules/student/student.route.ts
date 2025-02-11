import express from 'express';
import { StudentControllers } from './student.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/', auth(USER_ROLE.superAdmin, USER_ROLE.admin), StudentControllers.getStudents);
router.get('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty), StudentControllers.getAStudent);
router.delete('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), StudentControllers.deleteAStudent);
router.patch('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), StudentControllers.updateAStudent);

export const StudentRoutes = router;
