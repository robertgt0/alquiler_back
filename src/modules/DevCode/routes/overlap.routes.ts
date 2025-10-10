import { Router } from 'express';
import { checkOverlap } from '../controllers/overlap.controller';
const router = Router();
router.post('/check', checkOverlap);
export default router;