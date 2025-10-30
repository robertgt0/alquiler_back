import { Router } from "express";
import {crearTrabajoController, obtenerTrabajosController, obtenerTrabajoPorIdController, eliminarTrabajoController} from "../controllers/trabajo.controller";

const router = Router();


// Crear nuevo trabajo
router.post("/", crearTrabajoController);

// Obtener todos los trabajos
router.get("/", obtenerTrabajosController);

// Obtener trabajo por ID
router.get("/:id", obtenerTrabajoPorIdController);

// Eliminar trabajo
router.delete("/:id", eliminarTrabajoController);

export default router;
