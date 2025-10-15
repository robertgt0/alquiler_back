import { Router } from "express";
import devCodeRoutes from "../modules/DevCode";
import ejemploRoutes from "../modules/nombre_grupo_ejemplo";
import appointmentsRoutes from "@/modules/DevCode/routes/appointments.routes";

const router = Router();

router.use("/devcode", devCodeRoutes);
router.use("/grupo-ejemplo", ejemploRoutes);
router.use("/appointments", appointmentsRoutes);



export default router;
