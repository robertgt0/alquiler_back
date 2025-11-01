import { Router } from "express";
import {crearTrabajoController, obtenerTrabajosController, obtenerTrabajoPorIdController, eliminarTrabajoController,obtenerTrabajoProveedorController} from "../controllers/trabajo.controller";

const router = Router();


//obtener detalles del trabajo para el proveedor
router.get("/detalle/proveedor/:id", obtenerTrabajoProveedorController);


// Crear nuevo trabajo
router.post("/", crearTrabajoController);

// Obtener todos los trabajos
router.get("/", obtenerTrabajosController);

// Obtener trabajo por ID
router.get("/:id", obtenerTrabajoPorIdController);

// Eliminar trabajo
router.delete("/:id", eliminarTrabajoController);

export default router;
