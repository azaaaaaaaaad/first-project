import express from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import { AcademicFacultyValidations } from './academicFaculty.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(AcademicFacultyValidations.createAcademicValidationSchema),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);
router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  '/:facultyId',
  validateRequest(AcademicFacultyValidations.updateAcademicValidationSchema),
  AcademicFacultyControllers.updateSingleAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
