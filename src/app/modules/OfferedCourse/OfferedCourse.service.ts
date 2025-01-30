import { AppError } from '../../errors/AppError';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { SemesterRegistration } from '../semisterRegistration/semisterRegistration.model';
import { TOfferedCourse } from './OfferedCourse.interface';
import { OfferedCourse } from './OfferedCourse.model';
import httpStatus from 'http-status';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;

  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, ` semester registration not found`);
  }

  const academicSemester = isSemesterRegistrationExist.academicSemester;

  const isAcademicFacultyExist =
    await AcademicFacultyModel.findById(academicFaculty);

  if (!isAcademicFacultyExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      ` academic faculty does not exist`,
    );
  }

  const isAcademicDepartmentExist =
    await AcademicDepartmentModel.findById(academicDepartment);

  if (!isAcademicDepartmentExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      ` academic department does not exist`,
    );
  }

  const isCourseExist = await Course.findById(course);

  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, ` course does not exist`);
  }

  const isFacultyExist = await Faculty.findById(faculty);

  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, ` faculty does not exist`);
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
};
