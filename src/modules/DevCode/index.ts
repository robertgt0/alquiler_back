import { Router } from "express";
import availabilityRoutes from "./routes/availability.routes";

const router = Router();

router.use("/availability", availabilityRoutes);

export default router;
