import { Router } from "express";
import {
  getProveedores,
  getProveedor,
  getProviderBusySlots,
  getProviderAvailableSlots,
} from "../controllers/providers.controller";

const router = Router();

router.get("/", getProveedores);
router.get("/:providerId/available-slots", getProviderAvailableSlots);
router.get("/:providerId/busy-slots", getProviderBusySlots);
router.get("/:providerId", getProveedor);

export default router;