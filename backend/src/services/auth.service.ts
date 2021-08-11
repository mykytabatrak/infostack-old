import { getCustomRepository } from 'typeorm';
import { HttpError } from '../common/errors/http-error';
import { HttpCode } from '../common/enums/http-code';
import { IRegister } from '../common/interfaces/auth/register.interface';
import { ILogin } from '../common/interfaces/auth/login.interface';
import {
  IUserWithTokens,
  IUser,
} from '../common/interfaces/user/user-auth.interface';
import { ITokens } from './../common/interfaces/auth/tokens.interface';
import { IRefreshToken } from './../common/interfaces/auth/refresh-tokens.interface';
import {
  generateTokens,
  generateAccessToken,
} from '../common/utils/tokens.util';
import UserRepository from '../data/repositories/user.repository';
import RefreshTokenRepository from '../data/repositories/refresh-token.repository';
import { hash, verify } from '../common/utils/hash.util';
import { HttpErrorMessage } from '../common/enums/http-error-message';
import { sendMail } from '../common/utils/mailer.util';
import { IResetPassword } from '../common/interfaces/auth/reset-password.interface';
import { env } from '../env';
import { ISetPassword } from '../common/interfaces/auth/set-password.interface';
import jwt from 'jsonwebtoken';
import { mapPageToIPage } from '../common/mappers/page/map-page-to-ipage';

const setTokens = async (user: IUser): Promise<ITokens> => {
  const tokens = generateTokens(user.id);
  const refreshTokenRepository = getCustomRepository(RefreshTokenRepository);
  const refreshToken = refreshTokenRepository.create({
    user,
    token: tokens.refreshToken,
  });
  await refreshTokenRepository.save(refreshToken);

  return tokens;
};

export const register = async (
  body: IRegister,
): Promise<Omit<IUserWithTokens, 'refreshToken'>> => {
  const userRepository = getCustomRepository(UserRepository);
  const isEmailUsed = await userRepository.findByEmail(body.email);
  if (isEmailUsed) {
    throw new HttpError({
      status: HttpCode.CONFLICT,
      message: HttpErrorMessage.EMAIL_ALREADY_EXISTS,
    });
  }

  const hashedPassword = await hash(body.password);
  const { password, ...user } = await userRepository.save({
    ...body,
    password: hashedPassword,
  });
  const newFollowingPages = user.followingPages?.map((page) =>
    mapPageToIPage(page),
  );
  const userWithMappedPages = { ...user, followingPages: newFollowingPages };
  const tokens = await setTokens(userWithMappedPages);
  const { id, fullName, email, avatar, title, skills, followingPages } =
    userWithMappedPages;

  return {
    id,
    fullName,
    email,
    avatar,
    title,
    skills,
    followingPages,
    ...tokens,
  };
};

export const login = async (
  body: ILogin,
): Promise<Omit<IUserWithTokens, 'refreshToken'>> => {
  const userRepository = getCustomRepository(UserRepository);

  const user = await userRepository.findByEmail(body.email);
  if (!user) {
    throw new HttpError({
      status: HttpCode.NOT_FOUND,
      message: HttpErrorMessage.NO_SUCH_EMAIL,
    });
  }

  const isPasswordCorrect = await verify(body.password, user.password);
  if (!isPasswordCorrect) {
    throw new HttpError({
      status: HttpCode.BAD_REQUEST,
      message: HttpErrorMessage.INVALID_PASSWORD,
    });
  }
  const newFollowingPages = user.followingPages?.map((page) =>
    mapPageToIPage(page),
  );
  const userWithMappedPages = { ...user, followingPages: newFollowingPages };
  const tokens = await setTokens(userWithMappedPages);
  const { id, fullName, email, avatar, title, skills, followingPages } =
    userWithMappedPages;

  return {
    id,
    fullName,
    email,
    avatar,
    title,
    skills,
    followingPages,
    ...tokens,
  };
};

export const resetPassword = async (body: IResetPassword): Promise<void> => {
  const userRepository = getCustomRepository(UserRepository);
  const user = await userRepository.findByEmail(body.email);
  if (!user) {
    throw new HttpError({
      status: HttpCode.NOT_FOUND,
      message: HttpErrorMessage.NO_SUCH_EMAIL,
    });
  }

  const token = generateAccessToken(user.id);
  const { app } = env;
  const url = `${app.url}/set-password?token=${token}`;

  await sendMail({ to: user.email, subject: 'Reset Password', text: url });
};

export const setPassword = async (body: ISetPassword): Promise<void> => {
  const userRepository = getCustomRepository(UserRepository);
  const { token, password } = body;
  if (!token) {
    throw new HttpError({
      status: HttpCode.BAD_REQUEST,
      message: HttpErrorMessage.INVALID_TOKEN,
    });
  }

  const { app } = env;
  const decoded = jwt.verify(token, app.secretKey) as { userId: string };
  const hashedPassword = await hash(password);
  await userRepository.updatePasswordById(decoded.userId, hashedPassword);
};

export const refreshTokens = async (body: IRefreshToken): Promise<ITokens> => {
  try {
    const { refreshToken } = body;
    jwt.verify(refreshToken, env.app.secretKey);
    const refreshTokenRepository = getCustomRepository(RefreshTokenRepository);
    const userRefreshToken = await refreshTokenRepository.findByToken(
      refreshToken,
    );
    if (!userRefreshToken?.token) {
      throw new Error();
    }
    await refreshTokenRepository.remove(userRefreshToken);
    const newFollowingPages = userRefreshToken.user.followingPages?.map(
      (page) => mapPageToIPage(page),
    );
    const userWithMappedPages = {
      ...userRefreshToken.user,
      followingPages: newFollowingPages,
    };
    const tokens = await setTokens(userWithMappedPages);
    return tokens;
  } catch {
    throw new HttpError({
      status: HttpCode.UNAUTHORIZED,
      message: HttpErrorMessage.UNAUTHORIZED,
    });
  }
};

export const logout = async (body: IRefreshToken): Promise<void> => {
  const { refreshToken } = body;
  const refreshTokenRepository = getCustomRepository(RefreshTokenRepository);
  const userRefreshToken = await refreshTokenRepository.findByToken(
    refreshToken,
  );
  if (userRefreshToken?.token) {
    await refreshTokenRepository.remove(userRefreshToken);
  }
};
