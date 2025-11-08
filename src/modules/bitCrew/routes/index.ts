import { Router } from "express";

import billeteraRoutes from './wallet.routes';

const router = Router();

router.use('/billetera', billeteraRoutes);

export default router;
//hola