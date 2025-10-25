import { Router } from 'express';
import { crearTrabajoSolicitado } from '../controllers/trabajo-solicitado.controller';

const router = Router();

// Health check temporal
router.get('/ping', (_req, res) => res.json({ ok: true, scope: 'trabajo-solicitado' }));

// POST base
router.post('/', crearTrabajoSolicitado);

export default router;
