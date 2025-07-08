import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './middlewares/passport.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

function setupServer() {
  const app = express();
  app.use(express.json());
  app.use(cors({
    origin: ['https://localhost:3000', 'https://nodejs-hw-mongodb-08ns.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use(pino());
  app.use(cookieParser());
  app.use('/src/swagger', express.static(path.join(process.cwd(), 'src/swagger')));
  app.use(
    session({
      secret: process.env.JWT_SECRET || 'fallback-secret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
      }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/proxy/auth/google', (req, res) => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      response_type: 'code',
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL || 'https://localhost:3000/confirm-google-auth',
      scope: 'profile email',
    }).toString();
    res.json({ redirectUrl: googleAuthUrl });
  });
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Contacts API' });
  });
  const swaggerDocument = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs/swagger.json')));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущено на порту ${PORT}`);
  });
  return app;
}

export { setupServer };
