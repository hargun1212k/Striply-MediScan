import { Router } from 'express';
import { decodePattern, submitScanProof, getUserScanHistory } from './scans.controller.js';

const router = Router();

router.post('/decode', decodePattern);
router.post('/proof', submitScanProof);
router.get('/history', getUserScanHistory);

export default router;
