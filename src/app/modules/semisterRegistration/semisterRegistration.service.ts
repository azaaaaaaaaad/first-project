import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../errors/AppError';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { RegistrationStatus } from './semisterRegistration.constant';
import { TSemesterRegistration } from './semisterRegistration.interface';
import { SemesterRegistration } from './semisterRegistration.model';
import httpStatus from 'http-status';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [{ status: RegistrationStatus.UPCOMING }, { staus: RegistrationStatus.ONGOING }],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an upcoming ${isThereAnyUpcomingOrOngoingSemester.status} register semester`,
    );
  }

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

// const deleteSemesterRegistrationFromDB = async (id: string) => {};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const isSemesterRegistrationExist = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Semester is not found');
  }

  const currentSemesterStatus = isSemesterRegistrationExist.status;

  const requestedStatus = payload?.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already  ${currentSemesterStatus} ended`,
    );
  }

  if (currentSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }

  if (currentSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
//   deleteSemesterRegistrationFromDB,
};
