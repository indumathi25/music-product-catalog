import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { env } from './config/env';
import { logger } from './lib/logger';

const app = express();

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow image serving
    }),
);
app.use(
    cors({
        origin: env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve(env.UPLOADS_DIR)));

// Load OpenAPI spec from YAML
let swaggerSpec: any;
try {
    const yamlPath = path.resolve(__dirname, 'docs/openapi.yaml');
    const fileContent = fs.readFileSync(yamlPath, 'utf8');
    swaggerSpec = yaml.load(fileContent);
    // Dynamically update server URL based on env
    if (swaggerSpec && swaggerSpec.servers) {
        swaggerSpec.servers = [{ url: `http://localhost:${env.PORT}` }];
    }
} catch (err) {
    logger.error({ err }, 'Failed to load OpenAPI specification');
}

if (swaggerSpec) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));
}

registerRoutes(app);

app.use((_req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

app.use(errorHandler);

logger.info(`App configured. CORS origin: ${env.CORS_ORIGIN}`);
logger.info(`Storage provider: ${env.STORAGE_PROVIDER}`);

export { app };
