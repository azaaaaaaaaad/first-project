import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

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

const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {

  
  const isUserExist = await User.findOne({ id: user?.userId }).select('+password');
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
    payload?.oldPassword,
    isUserExist?.password,
  );

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.BAD_REQUEST, 'password did not matched');
  }

  //hash new password
  const newHashedPasssword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.jwt_access_token),
  );

await User.findOneAndUpdate(
    {
      id: user?.userId,
      role: user?.role,
    },
    {
      password: newHashedPasssword,
      needsPasswordChange: false,
      passwordChangedAt: new Date
    },
  );

  return null;
};

export const AuthServices = {
  loginUser,
  changePassword,
};
