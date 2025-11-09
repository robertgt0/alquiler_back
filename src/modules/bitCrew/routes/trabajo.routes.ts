/*
import { Router } from 'express';
import * as trabajoController from '../controllers/trabajo.controller';

const router = Router();

// Esta ruta se montará en /api/bitcrew/trabajos
router.get('/:usuario', trabajoController.handleGetTrabajosByUsuario);

export default router;
*/
import { Router } from 'express';
import * as trabajoController from '../controllers/trabajo.controller';

const router = Router();

// Se montará en /api/bitCrew/trabajos/:usuario
router.get('/:usuario', trabajoController.handleGetTrabajosByUsuario);

// ================================================================
// 🚀 NUEVA RUTA: Para pagar un trabajo (PUT porque actualiza)
// ================================================================
// Se montará en /api/bitCrew/trabajos/:id/pagar-efectivo
router.put(
  '/:id/pagar-efectivo', 
  trabajoController.handlePagarTrabajoEfectivo
);

export default router;