import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken'
import { isJWTIssuedBeforePasswordChanged } from '../../middlewares/auth';

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

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  const needsPasswordChange = isUserExist?.needsPasswordChange;

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const isUserExist = await User.findOne({ id: user?.userId }).select(
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
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async(token: string)=>{
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

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
   //create token and send it to user

   const jwtPayload = {
    userId: isUserExist?.id,
    role: isUserExist?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken
  }
}

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken
};
