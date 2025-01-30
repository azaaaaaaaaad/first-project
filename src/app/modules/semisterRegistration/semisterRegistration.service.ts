import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../errors/AppError';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semisterRegistration.interface';
import { SemesterRegistration } from './semisterRegistration.model';
import httpStatus from 'http-status';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  const isAcedemicSemesterExist =
    await AcademicSemesterModel.findById(academicSemester);

  if (!isAcedemicSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Semester doesn't exist");
  }

  const isSemesterRegistrationExist = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Semester already exist');
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {};

const updateSemesterRegistrationIntoDB = async () => {};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
