import 'dotenv/config';
import { app } from './app';
import { env } from './config/env';
import { logger } from './lib/logger';
import { prisma } from './lib/prisma';

const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
    logger.info(`📚 API docs: http://localhost:${env.PORT}/api-docs`);
});

const shutdown = async (): Promise<void> => {
    logger.info('Shutting down server...');
    server.close(async () => {
        await prisma.$disconnect();
        logger.info('Server closed.');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
