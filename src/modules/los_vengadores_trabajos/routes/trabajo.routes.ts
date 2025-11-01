import { Router } from "express";
import {crearTrabajoController, obtenerTrabajosController, obtenerTrabajoPorIdController, eliminarTrabajoController,obtenerTrabajoProveedorController} from "../controllers/trabajo.controller";
import {cancelarTrabajoProveedorController,TerminarTrabajoController} from "../controllers/trabajo.controller";
const router = Router();


//obtener detalles del trabajo para el proveedor
router.get("/detalles/proveedor/:id", obtenerTrabajoProveedorController);
//cancelar trabajo por el proveedor
router.put("/cancelar/proveedor/:trabajoId", cancelarTrabajoProveedorController);
// Ruta para marcar un trabajo como terminado
router.put("/terminar/:trabajoId", TerminarTrabajoController);


// Crear nuevo trabajo
router.post("/", crearTrabajoController);

// Obtener todos los trabajos
router.get("/", obtenerTrabajosController);

// Obtener trabajo por ID
router.get("/:id", obtenerTrabajoPorIdController);

// Eliminar trabajo
router.delete("/:id", eliminarTrabajoController);

export default router;
