// src/modules/los_vengadores_trabajos/routes/trabajo.routes.ts
import { Router } from 'express';

// Importamos las funciones del CONTROLADOR
import {
  crearTrabajoController,
  obtenerTrabajosController,
  obtenerTrabajoPorIdController,
  eliminarTrabajoController,
  getTrabajosProveedor,
  getTrabajosCliente
} from '../controllers/trabajo.controller';
import {cancelarTrabajoProveedorController,cancelarTrabajoClienteController,TerminarTrabajoController,obtenerTrabajoProveedorController,obtenerTrabajoClienteController} from "../controllers/trabajo.controller";

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
const router = Router();

// --- RUTAS PARA HU 1.7 y 1.8 ---
router.get('/proveedor', getTrabajosProveedor);
router.get('/cliente/:clienteId', getTrabajosCliente);

// --- TUS RUTAS EXISTENTES ---
router.get('/', obtenerTrabajosController);
router.post('/', crearTrabajoController);
router.get('/:id', obtenerTrabajoPorIdController);
router.delete('/:id', eliminarTrabajoController);

export default router;