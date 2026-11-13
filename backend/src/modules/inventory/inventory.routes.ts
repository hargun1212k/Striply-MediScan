import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { getStoreInventory, getFefoBatchToDispense } from './inventory.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', getStoreInventory);
router.get('/fefo/next', getFefoBatchToDispense);

export default router;

