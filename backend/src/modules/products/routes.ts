import { Router } from 'express';
import { productController } from './controller';
import { validate } from '../../middlewares/validate';
import { upload } from '../../middlewares/upload';
import { createProductSchema, updateProductSchema, productIdSchema } from './schema';

import { authMiddleware } from '../../middlewares/auth';
import { writeLimiter } from '../../middlewares/rateLimiter';

const router = Router();

// Public routes (GET)
router.get('/', productController.getAll);
router.get('/:id', validate(productIdSchema, 'params'), productController.getById);

// Protected routes (others) - requires authentication
router.use(authMiddleware);

router.post(
    '/',
    writeLimiter,
    upload.single('coverArt'),
    validate(createProductSchema),
    productController.create,
);

router.put(
    '/:id',
    writeLimiter,
    validate(productIdSchema, 'params'),
    upload.single('coverArt'),
    validate(updateProductSchema),
    productController.update,
);

router.delete('/:id', writeLimiter, validate(productIdSchema, 'params'), productController.delete);

export default router;
