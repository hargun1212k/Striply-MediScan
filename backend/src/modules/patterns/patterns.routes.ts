import { Router } from 'express';
import {
  generatePatternForBatch,
  generateBlisterFoilArtwork,
} from './patterns.controller.js';

const router = Router();

router.get('/:striplyBatchId', generatePatternForBatch);
router.post('/foil-artwork', generateBlisterFoilArtwork);

export default router;

