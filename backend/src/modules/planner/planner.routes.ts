import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { createMedicinePlan, getUserPlans } from './planner.controller.js';

const router = Router();

router.use(requireAuth);
router.post('/plans', createMedicinePlan);
router.get('/plans', getUserPlans);

export default router;

