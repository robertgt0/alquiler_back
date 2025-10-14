//src/modules/los_vengadores_trabajos/routes/calendario-disponibilidad.routes.ts
import { Router } from 'express';
import { DisponibilidadController } from '../controllers/calendario-disponibilidad.controller';

const router = Router();

// GET /api/disponibilidad/:proveedorId/calendario?mes=9&anio=2025
router.get('/:proveedorId/calendario', DisponibilidadController.obtenerCalendario);

// GET /api/disponibilidad/:proveedorId/horarios/:fecha
router.get('/:proveedorId/horarios/:fecha', DisponibilidadController.obtenerHorariosDia);

// GET /api/disponibilidad/:proveedorId/info
router.get('/:proveedorId/info', DisponibilidadController.obtenerInfoProveedor);

export default router;