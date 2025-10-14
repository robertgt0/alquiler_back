// src/modules/los_vengadores_trabajos/index.ts

import { Router } from 'express';
import trabajoRoutes from './routes/trabajo.routes';
import disponibilidad from './routes/calendario-disponibilidad.routes';

const router = Router();

// Ruta de bienvenida/informativa para el modulo de trabajos
router.get('/', (req, res) => {
  res.json({
    message: '📦 Módulo de Trabajos - Los Vengadores',
    version: '1.0.0',
    description: 'Endpoints para listar trabajos agendados para proveedores y clientes.',
    endpoints: {
      proveedor: '/api/vengadores/trabajos/proveedor',
      cliente: '/api/vengadores/trabajos/cliente/:clienteId',
      calendarioDisponibilidad: '/api/los_vengadores_trabajos/calendario-disponibilidad'
    }
  });
});


// Montar las sub-rutas funcionales del modulo (las que creamos)
router.use('/', trabajoRoutes);
router.use('/calendario-disponibilidad', disponibilidad);
export default router;