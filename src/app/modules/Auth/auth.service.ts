import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import jwt from 'jsonwebtoken'
import { isJWTIssuedBeforePasswordChanged } from '../../middlewares/auth';
import { sendEmail } from '../../utils/sendEmail';

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
    Number(config.jwt_access_secret),
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

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string)

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

const forgetPassword = async (userId: string) => {


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


  //create token and send it to user

  const jwtPayload = {
    userId: isUserExist?.id,
    role: isUserExist?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );


  const resetUILink = `${config.reset_pass_ui_link}?id=${isUserExist.id}&token=${resetToken}`

  sendEmail(isUserExist?.email, resetUILink)

  console.log(resetUILink);

}


const resetPassword = async (payload: { id: string, newPassword: string }, token: string) => {

  const isUserExist = await User.findOne({ id: payload.id }).select('+password');
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

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;



  if (payload.id !== decoded.userId) {
    console.log(payload.id, decoded.userId);
    throw new AppError(httpStatus.FORBIDDEN, 'you are forbidden')
  }

  const newHashedPasssword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds))

  await User.findOneAndUpdate({
    id: decoded.userId,
    role: decoded.role
  }, {
    password: newHashedPasssword,
    needsPasswordChange: false,
    passwordChangedAt: new Date()
  })
}

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword
};


