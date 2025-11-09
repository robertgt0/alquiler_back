// src/modules/DevCode/routes/oferta.routes.ts
import { Router } from 'express';
import { OfertaController } from '../controllers/oferta.controller';

const router = Router();

// Verificar nuevas ofertas para un cliente
router.get('/nuevas/:clienteId', OfertaController.verificarNuevasOfertas);

// Marcar ofertas como vistas
router.post('/marcar-vistas', OfertaController.marcarComoVistas);

export default router;