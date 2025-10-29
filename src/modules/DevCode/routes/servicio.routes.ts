import { Router } from 'express';
import { ServicioController } from '../controllers/servicio.controller';

const router = Router();

router.post('/', ServicioController.crear);
router.get('/', ServicioController.listar);
router.get('/proveedor/:proveedorId', ServicioController.listarPorProveedor);
router.get('/:id', ServicioController.obtener);
router.put('/:id', ServicioController.actualizar);
router.delete('/:id', ServicioController.eliminar);

export default router;
