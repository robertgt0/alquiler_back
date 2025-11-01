
import { Router } from "express";
import availabilityRoutes from "./routes/availability.routes";
import providersRoutes from "./routes/proveedor.routes";

const router = Router();

router.use("/availability", availabilityRoutes);
router.use("/providers", providersRoutes)

export default router;
