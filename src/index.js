import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

dotenv.config();

async function startApplication() {
    try {
        await initMongoConnection();
        const app = setupServer();
        const openApiPath = './docs/openapi.yaml';
        const file = fs.readFileSync(openApiPath, 'utf8');
        const swaggerDocument = YAML.parse(file);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } catch (error) {
        console.error('Failed to start application:', error);
        process.exit(1);
    }
}

startApplication();
