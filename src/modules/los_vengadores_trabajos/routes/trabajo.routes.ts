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
  confirmarTrabajoController,
  rechazarTrabajoController,
  cancelarTrabajoProveedorController,
  cancelarTrabajoClienteController,
  TerminarTrabajoController,
  obtenerTrabajoProveedorController,
  obtenerTrabajoClienteController,
  getDetallesTrabajoController, // 1. ✅ IMPORTAMOS TU NUEVO CONTROLADOR
  getCalificacionesPorProveedorController,
  guardarCalificacionController
} from '../controllers/trabajo.controller';

// 🔹 Confirmar o rechazar trabajo (HU1)
router.put("/:id/confirmar", confirmarTrabajoController);
router.put("/:id/rechazar", rechazarTrabajoController);

// --- RUTAS PARA HU 2 y HU 3 ---

// 2. ✅ CAMBIO AQUÍ: Usamos tu controlador que conecta a la BD real
router.get("/detalles/proveedor/:id", getDetallesTrabajoController);

router.get("/detalles/cliente/:id", obtenerTrabajoClienteController);
router.put("/cancelar/proveedor/:trabajoId", cancelarTrabajoProveedorController);
router.put("/cancelar/cliente/:trabajoId", cancelarTrabajoClienteController);
router.put("/terminar/:trabajoId", TerminarTrabajoController);

// --- RUTAS PARA HU 1.7 y 1.8 ---
router.get('/proveedor', getTrabajosProveedor);
router.get('/cliente/:clienteId', getTrabajosCliente);

//--- RUTAS PARA HU 5 y 6 ---
router.get('/proveedor/:proveedorId/calificaciones', getCalificacionesPorProveedorController);
router.put("/trabajo/:id/calificar", guardarCalificacionController);


// --- RUTAS EXISTENTES ---
router.get('/', obtenerTrabajosController);
router.post('/', crearTrabajoController);
router.get('/:id', obtenerTrabajoPorIdController);
router.delete('/:id', eliminarTrabajoController);

export default router;
