import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // invalid token
    jwt.verify(
      token,
      config.jwt_access_token as string,
      function (error, decoded) {
        // err
        if (error) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }

        req.user = decoded as JwtPayload;
        next();
      },
    );
  });
};

export default auth;
