import { Router } from 'express';
import { artistController } from './controller';

const router = Router();

router.get('/', artistController.searchByName);

export default router;
