import request from 'supertest';
import { app } from '../../../app';
import { productService } from '../service';

jest.mock('../service');

import { Request, Response, NextFunction } from 'express';

jest.mock('express-oauth2-jwt-bearer', () => ({
    auth: jest.fn(() => (req: Request, _res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            return next();
        }
        const error = new Error('UnauthorizedError');
        error.name = 'UnauthorizedError';
        (error as Error & { status: number }).status = 401;
        return next(error);
    }),
}));

const mockService = productService as jest.Mocked<typeof productService>;

const AUTH_HEADER = { Authorization: 'Bearer mock_jwt_token' };

const sampleProduct = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Abbey Road',
    artistName: 'The Beatles',
    coverArtUrl: 'http://localhost:4000/uploads/cover-test.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('Product Routes', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('GET /api/products', () => {
        it('returns 200 with product list', async () => {
            mockService.getAll.mockResolvedValue({ data: [sampleProduct], total: 1 });
            const res = await request(app).get('/api/products');
            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.total).toBe(1);
        });
    });

    describe('GET /api/products/:id', () => {
        it('returns 200 for valid ID', async () => {
            mockService.getById.mockResolvedValue(sampleProduct);
            const res = await request(app).get(`/api/products/${sampleProduct.id}`);
            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe(sampleProduct.id);
        });

        it('returns 400 for invalid ID format', async () => {
            const res = await request(app).get('/api/products/not-a-uuid');
            expect(res.status).toBe(400);
            expect(res.body.error.code).toBe('VALIDATION_ERROR');
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('returns 204 on successful delete', async () => {
            mockService.delete.mockResolvedValue(undefined);
            const res = await request(app)
                .delete(`/api/products/${sampleProduct.id}`)
                .set(AUTH_HEADER);
            expect(res.status).toBe(204);
        });

        it('returns 401 without auth header', async () => {
            const res = await request(app).delete(`/api/products/${sampleProduct.id}`);
            expect(res.status).toBe(401);
            expect(res.body.error.code).toBe('UNAUTHORIZED');
        });
    });
});
