import { Router } from "express";
import { getProveedores } from "../controllers/providers.controller";
import { getProveedor } from "../controllers/providers.controller";
const router = Router();

router.get("/", getProveedores);
router.get("/:providerId", getProveedor);

export default router;
