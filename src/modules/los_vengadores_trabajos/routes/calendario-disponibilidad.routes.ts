import { Router } from 'express';
import { DisponibilidadController } from '../controllers/calendario-disponibilidad.controller';

const router = Router();

router.get('/:proveedorId/horarios/:fecha', DisponibilidadController.obtenerHorariosDia);
router.get('/:proveedorId/info', DisponibilidadController.obtenerInfoProveedor);

export default router;