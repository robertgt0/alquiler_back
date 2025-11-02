import { Router } from "express";

import availabilityRoutes from "./routes/availability.routes";
import providersRoutes from "./routes/proveedor.routes";
import appointmentsRoutes from "./routes/appointments.routes"; 

const router = Router();

const log = (path: string) => console.log(`  - /api${path}`);

router.use("/availability", availabilityRoutes); log("/availability");
router.use("/providers", providersRoutes);       log("/providers");
router.use("/appointments", appointmentsRoutes); 
log("/appointments");

export default router;