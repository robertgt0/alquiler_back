import { Router } from "express";

import billeteraRoutes from "./wallet.routes";
import notificacionRoutes from "./notificacion.routes"; 

const router = Router();

router.use("/billetera", billeteraRoutes);

router.use("/notificaciones", notificacionRoutes);

export default router;
