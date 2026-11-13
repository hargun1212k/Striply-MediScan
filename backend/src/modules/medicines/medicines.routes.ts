import { Router } from 'express';
import { listMedicines, getMedicineByCode } from './medicines.controller.js';

const router = Router();

router.get('/', listMedicines);
router.get('/:code', getMedicineByCode);

export default router;

