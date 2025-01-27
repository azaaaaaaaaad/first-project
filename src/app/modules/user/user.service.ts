import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { IStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';

const createStudentIntoDB = async (password: string, studentData: IStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';

//generatedId
  const generatedId = async( payload: TAcademicSemester) =>{

  }

  //find academic semester info

  //set manually generated it
  userData.id = generatedId();

  // create a user
  const newUser = await UserModel.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    // set id , _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id; //reference _id

    const newStudent = await StudentModel.create(studentData);
    return newStudent;
  }
};
export const UserServices = {
  createStudentIntoDB,
};
