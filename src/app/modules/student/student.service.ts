import { StudentModel } from './student.model';

const getAllStudentsFromDb = async () => {
  const result = await StudentModel.find();
  return result;
};

const getAStudentFromDb = async (id: string) => {
  // const result = await StudentModel.findOne({ id });
  const result = await StudentModel.aggregate([{ $match: { id } }]);
  return result;
};

const deleteAStudentFromDb = async (id: string) => {
  const result = await StudentModel.updateOne({ id }, { isDeleted: true });
  return result;
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
