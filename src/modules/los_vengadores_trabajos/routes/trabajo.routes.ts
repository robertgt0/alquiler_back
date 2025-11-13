// src/modules/los_vengadores_trabajos/routes/trabajo.routes.ts
import { Router } from 'express';
const router = Router();

import {
  crearTrabajoController,
  obtenerTrabajosController,
  obtenerTrabajoPorIdController,
  eliminarTrabajoController,
  getTrabajosProveedor,
  getTrabajosCliente,
  confirmarTrabajoController,
  rechazarTrabajoController
} from '../controllers/trabajo.controller';
import {
  cancelarTrabajoProveedorController,
  cancelarTrabajoClienteController,
  TerminarTrabajoController,
  obtenerTrabajoProveedorController,
  obtenerTrabajoClienteController
} from "../controllers/trabajo.controller";

// 🔹 Confirmar o rechazar trabajo (HU1)
router.put("/:id/confirmar", confirmarTrabajoController);
router.put("/:id/rechazar", rechazarTrabajoController);

// --- Rutas HU2 y HU3 ---
router.get("/detalles/proveedor/:id", obtenerTrabajoProveedorController);
router.get("/detalles/cliente/:id", obtenerTrabajoClienteController);
router.put("/cancelar/proveedor/:trabajoId", cancelarTrabajoProveedorController);
router.put("/cancelar/cliente/:trabajoId", cancelarTrabajoClienteController);
router.put("/terminar/:trabajoId", TerminarTrabajoController);

// --- RUTAS PARA HU 1.7 y 1.8 ---
router.get('/proveedor', getTrabajosProveedor);
router.get('/cliente/:clienteId', getTrabajosCliente);

// --- EXISTENTES ---
router.get('/', obtenerTrabajosController);
router.post('/', crearTrabajoController);
router.get('/:id', obtenerTrabajoPorIdController);
router.delete('/:id', eliminarTrabajoController);

export default router;
