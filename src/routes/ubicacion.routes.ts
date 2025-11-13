import { Router } from 'express';
import { getAllUbicaciones } from '../controllers/ubicacion.controller';

const router = Router();
router.get('/', getAllUbicaciones);
export default router;