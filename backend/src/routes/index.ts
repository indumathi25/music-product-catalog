import { Express } from 'express';
import productRoutes from '../modules/products/routes';

export const registerRoutes = (app: Express): void => {
    app.get('/api/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.use('/api/products', productRoutes);
};
