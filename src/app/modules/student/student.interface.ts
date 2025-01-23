import { Schema, model, connect } from 'mongoose';

export type IGuardian ={
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
}

export type IUserName={
    firstName: string;
    middleName?: string;
    lastName: string;
}

export type ILocalGuardian ={
    name: string;
    occupation: string;
    contactNo: string;  
    address: string;
}

export type IStudent = {
    id: string;
    name: IUserName;
    gender: "male" | "female";
    dateOfBirth?: Date;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-";
    presentAddress: string;
    permanentAddress: string;
    guardian: IGuardian
    localGuardian: ILocalGuardian;
    profileImg?: string;
    isActive: 'active'|'blocked';
  }