import { Router } from 'express';
import { artistController } from './controller';

const router = Router();

router.get('/', artistController.getAll);
router.get('/search', artistController.searchByName);

export default router;
