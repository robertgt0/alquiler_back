import { Router } from "express";
import * as servicioController from "../controllers/servicioController.controller";

const router = Router();

router.post("/", servicioController.createServicio);
router.get("/", servicioController.getServicios);
router.get("/:id", servicioController.getServicioById);
router.put("/:id", servicioController.updateServicio);
router.delete("/:id", servicioController.deleteServicio);

export default router;
