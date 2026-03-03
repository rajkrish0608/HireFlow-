import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { create, list, getById, update } from './jobs.controller';

const router = Router();

router.use(authenticate);

router.post('/create', authorize('HR', 'ADMIN'), create);
router.get('/', authorize('HR', 'ADMIN'), list);
router.get('/:id', authorize('HR', 'ADMIN'), getById);
router.patch('/:id', authorize('HR', 'ADMIN'), update);

export default router;
