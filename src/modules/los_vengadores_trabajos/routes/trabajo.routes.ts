// src/modules/los_vengadores_trabajos/routes/trabajo.routes.ts
import { Router } from 'express';
const router = Router();

// Importamos las funciones del CONTROLADOR
import {
  crearTrabajoController,
  obtenerTrabajosController,
  obtenerTrabajoPorIdController,
  eliminarTrabajoController,
  getTrabajosProveedor,
  getTrabajosCliente,
  confirmarTrabajoController,   // ✅ NUEVO
  rechazarTrabajoController     // ✅ NUEVO
} from '../controllers/trabajo.controller';

/* 🔹 RUTAS NUEVAS PARA HU 1 (Proveedor: Confirmar / Rechazar trabajo)        */
/* -------------------------------------------------------------------------- */

// Confirmar trabajo (cambia estado a "confirmado")
router.put('/:id/confirmar', confirmarTrabajoController);

// Rechazar trabajo (cambia estado a "cancelado")
router.put('/:id/rechazar', rechazarTrabajoController);

/* -------------------------------------------------------------------------- */
/* 🔹 RUTAS PARA HU 1.7 (Proveedor) Y HU 1.8 (Cliente)                        */
/* -------------------------------------------------------------------------- */
//obtener detalles del trabajo para el proveedor
router.get("/detalles/proveedor/:id", obtenerTrabajoProveedorController);
//obtener detalles del trabajo para el cliente
router.get("/detalles/cliente/:id", obtenerTrabajoClienteController);
//cancelar trabajo por el proveedor
router.put("/cancelar/proveedor/:trabajoId", cancelarTrabajoProveedorController);
//cancelar trabajo por el cliente
router.put("/cancelar/cliente/:trabajoId", cancelarTrabajoClienteController);
// Ruta para marcar un trabajo como terminado
router.put("/terminar/:trabajoId", TerminarTrabajoController);

router.get('/proveedor', getTrabajosProveedor);
router.get('/cliente/:clienteId', getTrabajosCliente);

/* -------------------------------------------------------------------------- */
/* 🔹 RUTAS EXISTENTES                                                        */
/* -------------------------------------------------------------------------- */

router.get('/', obtenerTrabajosController);
router.post('/', crearTrabajoController);
router.get('/:id', obtenerTrabajoPorIdController);
router.delete('/:id', eliminarTrabajoController);

export default router;
