import { Router } from "express";

import billeteraRoutes from './wallet.routes';
import fixerRoutes from './fixer.routes';
import trabajoRoutes from './trabajo.routes';


const router = Router();

router.use('/billetera', billeteraRoutes);
router.use('/fixers', fixerRoutes);
router.use('/trabajos', trabajoRoutes);

export default router;
