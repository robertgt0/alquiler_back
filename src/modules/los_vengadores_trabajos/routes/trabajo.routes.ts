// src/modules/los_vengadores_trabajos/routes/trabajo.routes.ts
import { Router } from 'express';
import { getTrabajosProveedor, getTrabajosCliente } from '../controllers/trabajo.controller';

const router = Router();

// Ruta para HU 1.7: aca obtenemos la lista de trabajos para el proveedor logueado
router.get('/proveedor', getTrabajosProveedor);

// Ruta para HU 1.8: aca obtenemos la lista de trabajos para un cliente especifico por su ID
router.get('/cliente/:clienteId', getTrabajosCliente);

export default router;