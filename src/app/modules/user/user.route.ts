import express from 'express';
import { UserControllers } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { AdminValidations } from '../Admin/admin.validation';

const router = express.Router();

router.post(
  '/create-student',
  // auth(USER_ROLE.admin),
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;
