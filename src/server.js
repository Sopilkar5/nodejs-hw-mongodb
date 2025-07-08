import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './middlewares/passport.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import https from 'https';

function setupServer() {
  const app = express();
  app.use(express.json());
app.use(cors({
  origin: ['https://localhost:3000','https://nodejs-hw-mongodb-08ns.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
  app.use(pino());
  app.use(cookieParser());

  app.use('/src/swagger', express.static(path.join(process.cwd(), 'src/swagger')));
  app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const swaggerDocument = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs/swagger.json')));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  const sslOptions = {
    key: fs.readFileSync(path.join(process.cwd(), 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(process.cwd(), 'localhost.pem')),
  };
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT} (HTTPS)`);
  });

  return app;
}

export { setupServer };
