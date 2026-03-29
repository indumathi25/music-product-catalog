import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import { env } from './config/env';
import { logger } from './lib/logger';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { globalLimiter } from './middlewares/rateLimiter';
import {
    securityMiddleware,
    corsMiddleware,
    explicitSecurityHeaders
} from './config/security';
import { setupSwagger } from './config/swagger';

const app = express();

//1. Global Middleware (Security, Parsing, Performance)
app.use(compression());
app.use(securityMiddleware);
app.use(explicitSecurityHeaders);
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Static Assets & Documentation
setupSwagger(app);

// 3. API Routes & Protection
app.use('/api/', globalLimiter);
registerRoutes(app);

// 4. Error Handling & 404
app.use((_req, res) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'Route not found'
        }
    });
});

app.use(errorHandler);

// Startup Log
logger.info(`Backend initialized in ${env.NODE_ENV} mode.`);

export { app };
