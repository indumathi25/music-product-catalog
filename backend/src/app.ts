import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { env } from './config/env';
import { logger } from './lib/logger';
import { globalLimiter } from './middlewares/rateLimiter';

const app = express();

app.use(compression());

// Security Headers
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow image serving
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "blob:", "*.amazonaws.com", "loremflickr.com"],
                connectSrc: ["'self'", "*.amazonaws.com"],
                frameAncestors: ["'none'"], // Protect against Iframes (Clickjacking)
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
    }),
);

// Frame Protection & Sniffing Protection (Explicit)
app.use((_req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// Rate Limiting
app.use('/api/', globalLimiter);

app.use(
    cors({
        origin: env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
        credentials: true,
    }),
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve(env.UPLOADS_DIR), {
    maxAge: '1y',
    immutable: true,
    fallthrough: false,
}));

// Load OpenAPI spec from YAML
let swaggerSpec: Record<string, unknown> | undefined;
try {
    const yamlPath = path.resolve(__dirname, 'docs/openapi.yaml');
    const fileContent = fs.readFileSync(yamlPath, 'utf8');
    const loaded = yaml.load(fileContent) as Record<string, unknown>;

    if (loaded && typeof loaded === 'object' && 'servers' in loaded) {
        (loaded as { servers: unknown[] }).servers = [{ url: `http://localhost:${env.PORT}` }];
    }
    swaggerSpec = loaded;
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
