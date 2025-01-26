import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  //semester name -> semster code

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemesterModel.create(payload);
  return result;
};

const getAllAcademicSemesterFromDB = async () => {
  const result = AcademicSemesterModel.find();
  return result;
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemesterModel.findById(id);
  return result;
};

const updateSingleAcademicsemesterIntoDB = async (id: string, updateData:Partial<TAcademicSemester>) => {
  const result = await AcademicSemesterModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    {new:true},
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateSingleAcademicsemesterIntoDB,
};
