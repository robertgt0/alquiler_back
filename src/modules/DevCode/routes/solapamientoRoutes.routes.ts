import { Router } from 'express';
import { checkOverlap } from '../controllers/solapamientoController.controller';
const router = Router();
router.post('/check', checkOverlap);
export default router;