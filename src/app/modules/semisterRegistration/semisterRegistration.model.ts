import { model, Schema } from 'mongoose';
import { TSemesterRegistration } from './semisterRegistration.interface';

const semesterRegistrationSchema = new Schema<TSemesterRegistration>({});

export const SemeterRegistration = model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);
