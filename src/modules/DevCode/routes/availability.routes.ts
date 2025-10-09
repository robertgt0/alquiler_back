import { Router } from "express";
import { getProviderAvailability } from "../controllers/availability.controller";

const router = Router();

router.get("/:providerId", getProviderAvailability);

export default router;
