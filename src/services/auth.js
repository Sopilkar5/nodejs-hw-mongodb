import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import User from '../model/user.js';
import Session from '../model/session.js';

export async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const user = await User.create({ name, email, password });
  return user;
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, 'Email or password is incorrect');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}

export async function refreshUserSession(refreshToken) {
  const session = await Session.findOne({ refreshToken });
  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createError(401, 'Refresh token expired or invalid');
  }

  await Session.deleteOne({ _id: session._id });

  const newAccessToken = randomBytes(30).toString('base64');
  const newRefreshToken = randomBytes(30).toString('base64');

  await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken: newAccessToken, newRefreshToken };
}

export async function logoutUser(refreshToken) {
  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createError(401, 'Session not found');
  }
}
