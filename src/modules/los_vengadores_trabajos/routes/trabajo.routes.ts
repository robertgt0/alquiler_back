// src/modules/los_vengadores_trabajos/routes/trabajo.routes.ts
import { Router } from 'express';
import { getTrabajosProveedor, getTrabajosCliente } from '../controllers/trabajo.controller';

const router = Router();

// Ruta para HU 1.7: Obtener la lista de trabajos para el proveedor logueado
router.get('/proveedor', getTrabajosProveedor);

// Ruta para HU 1.8: Obtener la lista de trabajos para un cliente específico por su ID
router.get('/cliente/:clienteId', getTrabajosCliente);

export default router;