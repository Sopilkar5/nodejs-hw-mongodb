import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function startApplication() {
  try {
    await initMongoConnection();
    const app = setupServer();
    const swaggerDocument = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs/swagger.json')));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

startApplication();
