import { Router } from 'express';
import {
  registerBatch,
  registerMultipleBatches,
  getBatchByStriplyId,
  updateExistingBatchStock,
} from './batches.controller.js';

const router = Router();

router.post('/register', registerBatch);
router.post('/register-bulk', registerMultipleBatches);
router.get('/:striplyBatchId', getBatchByStriplyId);
router.patch('/:striplyBatchId/stock', updateExistingBatchStock);

export default router;

