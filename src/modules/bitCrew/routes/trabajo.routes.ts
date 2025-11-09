import { Router } from 'express';
import * as trabajoController from '../controllers/trabajo.controller';

const router = Router();

// Se montará en /api/bitCrew/trabajos/:usuario
router.get('/:usuario', trabajoController.handleGetTrabajosByUsuario);

// Se montará en /api/bitCrew/trabajos/:id/pagar-efectivo
router.put(
  '/:id/pagar-efectivo', 
  trabajoController.handlePagarTrabajoEfectivo
);

export default router;