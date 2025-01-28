/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenereicErrorResponse } from '../interface/error';

export const handleDuplicateError = (error: any): TGenereicErrorResponse => {
  const match = error.message.match(/"([^"]*)"/);
  const extracted_message = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extracted_message} is already exist`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: ' Invalid Id',
    errorSources,
  };
};
