import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { logger } from '../lib/logger';
import { AppConstants } from '../constants';

export const setupSwagger = (app: Express) => {
    try {
        const yamlPath = path.resolve(__dirname, '../docs/openapi.yaml');
        if (!fs.existsSync(yamlPath)) {
            logger.warn('OpenAPI specification not found, skipping Swagger UI setup');
            return;
        }

        const fileContent = fs.readFileSync(yamlPath, 'utf8');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const swaggerSpec = yaml.load(fileContent) as Record<string, any>;

        if (swaggerSpec && swaggerSpec.servers) {
            swaggerSpec.servers = [{ url: AppConstants.DEFAULT_API_URL }];
        }

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

        logger.info('Swagger UI configured at /api-docs');
    } catch (err) {
        logger.error({ err }, 'Failed to load OpenAPI specification');
    }
};
