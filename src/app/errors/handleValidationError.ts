import mongoose from 'mongoose';
import { TErrorSources, TGenereicErrorResponse } from '../interface/error';



export const handleValidationError = (error: mongoose.Error.ValidationError) : TGenereicErrorResponse => {
  const errorSources: TErrorSources = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

 

  const statusCode = 400;
  return {
    statusCode,
    message: ' Validation Error',
    errorSources,
  };
};
