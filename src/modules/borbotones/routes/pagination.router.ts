import { Router } from 'express';
import {
  getUsuariosPaginados
} from '../controllers/pagination.controller';

const router = Router();

// Cambia las rutas para que no repitan "borbotones"
router.get('/usuarios', getUsuariosPaginados);

export default router;