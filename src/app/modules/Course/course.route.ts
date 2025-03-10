import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidtions } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidtions.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty, USER_ROLE.student),
  CourseControllers.getAllCourses);
router.get('/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty, USER_ROLE.student),
  CourseControllers.getSingleCourse);

router.delete('/:id', CourseControllers.deleteSingleCourse);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),

  validateRequest(CourseValidtions.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidtions.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidtions.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
