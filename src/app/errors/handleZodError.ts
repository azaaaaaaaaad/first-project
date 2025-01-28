import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenereicErrorResponse } from "../interface/error";

  export const handleZodError = (error: ZodError) : TGenereicErrorResponse => {
    const errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue.message,
      };
    });

    const statusCode = 400;
    return {
      statusCode,
      message: ' Validation Error',
      errorSources,
    };
  };