import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidtions } from './course.validation';
import { CourseControllers } from './course.controller';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidtions.createCourseValidationSchema),
  CourseControllers.createCourse
);

router.get('/', CourseControllers.getAllCourses);
router.get('/:id', CourseControllers.getSingleCourse);

router.delete('/:id', CourseControllers.deleteSingleCourse);


router.patch(
  '/:id',
  validateRequest(CourseValidtions.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

export const CourseRoutes = router;
