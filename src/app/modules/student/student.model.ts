import { Schema, model } from 'mongoose';
import { IGuardian, ILocalGuardian, IStudent, IUserName } from './student.interface';


const userNameSchema = new Schema<IUserName>(
    { 
        firstName: {type: String, required: true},
        middleName: {type: String},
        lastName: {type: String, required: true}
     }
)

const guardianSchema = new Schema<IGuardian>(
    {
        fatherName: {type: String, required: true},
        fatherOccupation: {type: String, required: true},
        fatherContactNo: {type: String, required: true},
        motherName: {type: String, required: true},
        motherOccupation: {type: String, required: true},
        motherContactNo: {type: String, required: true}
    }
)

const localGuardianSchema = new Schema<ILocalGuardian>(
    {
        name: {type: String, required: true},
        occupation: {type: String, required: true},
        contactNo: {type: String, required: true},
        address: {type: String, required: true}
    }
)

const studentSchema = new Schema<IStudent>({
    id: {type:String},
    name: userNameSchema,
     gender:['male','female'],
     dateOfBirth: {type: Date},
        email: {type: String, required: true},
        contactNo: {type: String, required: true},
        emergencyContactNo: {type: String, required: true},
        bloodGroup: ['A+','A-','B+','B-','AB+','AB-','O+','O-'],
        presentAddress: {type: String, required: true},
        permanentAddress: {type: String, required: true},
        guardian: guardianSchema,
        localGuardian: localGuardianSchema,
        profileImg: {type: String},
        isActive: ['active','blocked']
  });


 export const StudentModel = model<IStudent>('Student', studentSchema);