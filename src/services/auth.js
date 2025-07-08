import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
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

export async function loginUser(email, password, isGoogleAuth = false) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Email or password is incorrect');
  }

  if (!isGoogleAuth && !(await bcrypt.compare(password, user.password))) {
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

export async function generateResetToken(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
  return token;
}

export async function resetPassword(token, password) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw createError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });
  await Session.deleteMany({ userId: user._id });
}
