import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

function setupServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(pino());
  app.use(cookieParser());
  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
  });
}

export { setupServer };
