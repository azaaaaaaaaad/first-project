import mongoose from "mongoose";
import { TErrorSources, TGenereicErrorResponse } from "../interface/error";

export const handleCastError = (error: mongoose.Error.CastError) :  TGenereicErrorResponse => {

    const errorSources :TErrorSources = [{
        path: error.path,
        message: error.message
    }]

    const statusCode = 400;
    return {
      statusCode,
      message: ' Invalid Id',
      errorSources,
    };

}