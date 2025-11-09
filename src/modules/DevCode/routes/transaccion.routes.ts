import { Router } from 'express';
import * as transaccionController from '../controllers/transaccion.controller';

const router = Router();

// Se montará en /api/bitCrew/historial/:usuario
router.get('/:usuario', transaccionController.handleGetTransaccionesByUsuario);

export default router;