import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

export const isJWTIssuedBeforePasswordChanged = (
  passwordChangedTimestamp: Date,
  jwtIssuedTimeStamp: number,
): boolean => {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimeStamp;
};

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { userId, role, iat } = decoded;

    const isUserExist = await User.findOne({ id: userId }).select('+password');
    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'user not found');
    }

    const isDeleted = isUserExist?.isDeleted;
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'user is deleted');
    }

    const userStatus = isUserExist?.status;
    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'user is blocked');
    }

    // Validate if JWT is still valid after password change
    if (isUserExist.passwordChangedAt && iat) {
      const isTokenExpired = isJWTIssuedBeforePasswordChanged(
        isUserExist.passwordChangedAt,
        iat,
      );
      if (isTokenExpired) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Token expired due to password change',
        );
      }
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, `you are not  authorized`);
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
