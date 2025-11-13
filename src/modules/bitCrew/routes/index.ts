import { Router } from "express";

import billeteraRoutes from "./wallet.routes";
import fixerRoutes from "./fixer.routes";
import trabajoRoutes from "./trabajo.routes";
import transaccionRoutes from "./transaccion.routes";
import notificacionRoutes from "./notificacion.routes";
import recargaRoutes from './recarga.routes'; // <--- ruta para recargaQR

const router = Router();

router.use("/billetera", billeteraRoutes);
router.use("/fixers", fixerRoutes);
router.use("/trabajos", trabajoRoutes);
router.use("/historial", transaccionRoutes);
router.use("/notificaciones", notificacionRoutes);
router.use('/recarga', recargaRoutes); // para recarga

export default router;
