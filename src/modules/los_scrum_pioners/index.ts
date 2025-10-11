// src/modules/los_scrum_pioners/index.ts
import { Router } from 'express';
import fixerRoutes from './routes/fixer.routes';

const router = Router();

// Montar las rutas del módulo
router.use('/fixers', fixerRoutes);

export default router;