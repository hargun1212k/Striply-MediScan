import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { getActiveRecalls, quarantineBatch } from './recalls.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', getActiveRecalls);
router.patch('/:medicineCode/:batchCode/quarantine', quarantineBatch);

export default router;

