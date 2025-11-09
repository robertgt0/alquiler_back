import { Router } from "express";

import billeteraRoutes from './wallet.routes';
import fixerRoutes from './fixer.routes';
import trabajoRoutes from './trabajo.routes';
import transaccionRoutes from './transaccion.routes';
import recargaRoutes from './recarga.routes';

const router = Router();

router.use('/billetera', billeteraRoutes);
router.use('/fixers', fixerRoutes);
router.use('/trabajos', trabajoRoutes);
router.use('/historial', transaccionRoutes);
router.use('/recarga', recargaRoutes);

export default router;