import { Router } from 'express';
import { productController } from './controller';
import { validate } from '../../middlewares/validate';
import { upload } from '../../middlewares/upload';
import { createProductSchema, updateProductSchema, productIdSchema } from './schema';

const router = Router();

router.get('/', productController.getAll);

router.get('/:id', validate(productIdSchema, 'params'), productController.getById);

router.post(
    '/',
    upload.single('coverArt'),
    validate(createProductSchema),
    productController.create,
);

router.put(
    '/:id',
    validate(productIdSchema, 'params'),
    upload.single('coverArt'),
    validate(updateProductSchema),
    productController.update,
);

router.delete('/:id', validate(productIdSchema, 'params'), productController.delete);

export default router;
