import { AppError } from '../../errors/AppError';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { SemesterRegistration } from '../semisterRegistration/semisterRegistration.model';
import { TOfferedCourse } from './OfferedCourse.interface';
import { OfferedCourse } from './OfferedCourse.model';
import httpStatus from 'http-status';
import { hasTimeConflict } from './OfferedCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      ` semester registration not found`,
    );
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

  const isDepartmentBelongToFaculty = await AcademicDepartmentModel.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ` This ${isAcademicDepartmentExist.name} department does not belongs to ${isAcademicFacultyExist.name}`,
    );
  }

  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ` offered course with same section is alredy exist`,
    );
  }

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      ` this faculty is not available at that time`,
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExist = await OfferedCourse.findById(id);

  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, ` offered course not found`);
  }

  const isFacultyExist = await Faculty.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, ` faculty not found`);
  }

  const semesterRegistration = isOfferedCourseExist.semesterRegistration;

  const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration)

  if (semesterRegistrationStatus?.status !==  'UPCOMING') {
    throw new AppError(
        httpStatus.BAD_REQUEST,
        ` you cannot update this offered course as it is ${semesterRegistrationStatus?.status}`,
      );
  }

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      ` this faculty is not available at that time`,
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
};
