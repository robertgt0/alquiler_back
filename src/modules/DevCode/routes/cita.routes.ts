import { Router } from 'express';
import { CitaController } from '../controllers/cita.controller';

const router = Router();

router.post('/', CitaController.crear);
router.get('/proveedor/:proveedorId', CitaController.listarPorProveedor);
router.get('/cliente/:clienteId', CitaController.listarPorCliente);
router.put('/:id', CitaController.actualizar);   
router.delete('/:id', CitaController.eliminar);      

export default router;
