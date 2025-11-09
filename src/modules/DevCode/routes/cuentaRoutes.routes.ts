import { Router } from "express";
import * as cuentaController from "../controllers/cuentaController.controller";

const router = Router();

router.post("/", cuentaController.createCuenta);
router.get("/", cuentaController.getCuentas);
router.get("/:id", cuentaController.getCuentaById);
router.put("/:id", cuentaController.updateCuenta);
router.delete("/:id", cuentaController.deleteCuenta);

export default router;
