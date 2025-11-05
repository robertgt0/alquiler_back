import { Router } from 'express';
import { ProveedorController } from '../controllers/proveedor.controller';

const router = Router();

router.post('/', ProveedorController.crear);
router.get('/', ProveedorController.listar);
router.get('/:id', ProveedorController.obtener);
router.get('/:id/disponibilidad', ProveedorController.disponibilidad);
router.put('/:id/horarioLaboral', ProveedorController.guardarHorarioLaboral);
export default router;
