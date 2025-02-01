import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';

// const loginUser = async (payload: TLoginUser) => {
//   const isUserExist = await User.findOne({ id: payload?.id }).select(
//     '+password',
//   );
//   if (!isUserExist) {
//     throw new AppError(httpStatus.NOT_FOUND, 'user not found');
//   }

//   const isDeleted = isUserExist?.isDeleted;
//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'user is deleted');
//   }

//   const userStatus = isUserExist?.status;
//   if (userStatus === 'blocked') {
//     throw new AppError(httpStatus.FORBIDDEN, 'user is blocked');
//   }

//   const isPasswordCorrect = await bcrypt.compare(
//     payload?.password,
//     isUserExist?.password,
//   );

//   if (!isPasswordCorrect) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'password did not matched');
//   }

//   //use of jwt

//   const jwtPayload = {
//     userId: isUserExist?.id,
//     role: isUserExist?.role,
//   };

//   const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
//     expiresIn: '10d',
//   });

//   return {
//     accessToken,
//     needsPasswordChange: isUserExist?.needsPasswordChange,
//   };
// };

const loginUser = async (payload: TLoginUser) => {
  const isUserExist = await User.findOne({ id: payload?.id }).select(
    '+password',
  );
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

  const isPasswordCorrect = await bcrypt.compare(
    payload?.password,
    isUserExist?.password,
  );

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.BAD_REQUEST, 'password did not matched');
  }

  //create token and send it to user

  const jwtPayload = {
    userId: isUserExist?.id,
    role: isUserExist?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
    expiresIn: '10d',
  });

  const needsPasswordChange = isUserExist?.needsPasswordChange;

  return {
    accessToken,
    needsPasswordChange,
  };
};

// const changePassword = async (
//   userData: JwtPayload,
//   payload: { oldPassword: string; newPassword: string },
// ) => {
//   console.log(userData);

//   const isUserExist = await User.findOne({ id: userData?.userId }).select(
//     '+password',
//   );
//   if (!isUserExist) {
//     throw new AppError(httpStatus.NOT_FOUND, 'user not found');
//   }

//   const isDeleted = isUserExist?.isDeleted;
//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'user is deleted');
//   }

//   const userStatus = isUserExist?.status;
//   if (userStatus === 'blocked') {
//     throw new AppError(httpStatus.FORBIDDEN, 'user is blocked');
//   }

//   const isPasswordCorrect = await bcrypt.compare(
//     payload?.oldPassword,
//     isUserExist?.password,
//   );

//   if (!isPasswordCorrect) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'password did not matched');
//   }

//   //new hashed password
//   const newHashedPassword = await bcrypt.hash(
//     payload?.newPassword,
//     Number(config.bcrypt_salt_rounds),
//   );

//   await User.findOneAndUpdate(
//     {
//       id: userData.userId,
//       role: userData.role,
//     },
//     {
//       password: newHashedPassword,
//       needsPasswordChange: false,
//       passwordChangedAt: new Date(),
//     },
//   );
//   return null;
// };

export const AuthServices = {
  loginUser,
  // changePassword,
};
