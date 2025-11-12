import { Router } from "express";
import * as proveedorController from "../controllers/proveedorController.controller";

const router = Router();

router.post("/", proveedorController.createProveedor);
router.get("/", proveedorController.getProveedores);
router.get("/:id", proveedorController.getProveedorById);
router.put("/:id", proveedorController.updateProveedor);
router.delete("/:id", proveedorController.deleteProveedor);

export default router;
