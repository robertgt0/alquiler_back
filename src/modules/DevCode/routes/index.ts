import { Router } from "express";
import userRoutes from "./userRoutes.routes";
import proveedorRoutes from "./proveedorRoutes.routes";
import servicioRoutes from "./servicioRoutes.routes";
import ofertaRoutes from "./ofertaRoutes.routes";
import notificacionRoutes from "./notificacionRoutes.routes";
import calendarioRoutes from "./calendarioRoutes.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/proveedores", proveedorRoutes);
router.use("/servicios", servicioRoutes);
router.use("/ofertas", ofertaRoutes);
router.use("/notificaciones", notificacionRoutes);
router.use("/calendarios", calendarioRoutes);

export default router;
