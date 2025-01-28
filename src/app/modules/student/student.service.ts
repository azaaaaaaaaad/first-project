/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserModel } from '../user/user.model';

const getAllStudentsFromDb = async () => {
  const result = await StudentModel.find().populate([
    {
      path: 'admissionSemester',
    },
    {
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    },
  ]);
  return result;
};

const getAStudentFromDb = async (id: string) => {
  // const result = await StudentModel.findOne({ id });
  const result = await StudentModel.findOne({ id }).populate([
    {
      path: 'admissionSemester',
    },
    {
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    },
  ]);
  return result;
};

const deleteAStudentFromDb = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
  }
};

const updateAStudentFromDb = async (id: string) => {
  const result = await StudentModel.updateOne(
    { id },
    {
      $set: {},
    },
  );
  return result;
};

export const StudentServices = {
  getAllStudentsFromDb,
  getAStudentFromDb,
  deleteAStudentFromDb,
  updateAStudentFromDb,
};
