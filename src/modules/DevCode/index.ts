import { Router } from "express";
import availabilityRoutes from "./routes/availability.routes";
import providerRoutes from "./routes/provider.routes"

const router = Router();
router.use("/ejemploProvider",providerRoutes)
router.use("/availability", availabilityRoutes);

export default router;
