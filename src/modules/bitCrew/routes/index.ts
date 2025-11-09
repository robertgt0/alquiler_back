import { Router } from "express";

import billeteraRoutes from './wallet.routes';
import fixerRoutes from './fixer.routes';
import trabajoRoutes from './trabajo.routes';
import transaccionRoutes from './transaccion.routes';


const router = Router();

router.use('/billetera', billeteraRoutes);
router.use('/fixers', fixerRoutes);
router.use('/trabajos', trabajoRoutes);
router.use('/historial', transaccionRoutes);


export default router;
