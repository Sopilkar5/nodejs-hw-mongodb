import createError from 'http-errors';
import Session from '../model/session.js';
import User from '../model/user.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError(401, 'Authorization header must be Bearer token'));
  }

  const token = authHeader.replace('Bearer ', '');

  const session = await Session.findOne({ accessToken: token });
  if (!session || session.accessTokenValidUntil < new Date()) {
    return next(createError(401, 'Access token expired or invalid'));
  }

  const user = await User.findById(session.userId);
  if (!user) {
    return next(createError(401, 'User not found'));
  }

  req.user = user;
  next();
}
