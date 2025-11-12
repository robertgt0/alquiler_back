import { Router } from 'express';
import * as trabajoController from '../controllers/trabajo.controller';

const router = Router();

// Esta ruta se montará en /api/bitcrew/trabajos
router.get('/:usuario', trabajoController.handleGetTrabajosByUsuario);

export default router;