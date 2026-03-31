import { Express } from 'express';
import productRoutes from '../modules/products/routes';
import artistRoutes from '../modules/artists/routes';

export const registerRoutes = (app: Express): void => {
    app.get('/api/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.use('/api/products', productRoutes);
    app.use('/api/artists', artistRoutes);
};
