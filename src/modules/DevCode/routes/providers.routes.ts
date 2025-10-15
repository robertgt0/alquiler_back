import { Router } from "express";
import { getProveedores } from "../controllers/providers.controller";
import { getProveedor } from "../controllers/providers.controller";
import { getProviderBusySlots } from "../controllers/providers.controller";
import { getProviderAvailableSlots } from "../controllers/providers.controller";

const router = Router();

router.get("/", getProveedores);
router.get("/:providerId/busy-slots", getProviderBusySlots);
router.get("/:providerId/available-slots", getProviderAvailableSlots);
router.get("/:providerId", getProveedor);


export default router;
