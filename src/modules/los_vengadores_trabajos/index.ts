import { Router } from 'express';
import trabajoRoutes from './routes/trabajo.routes';
import disponibilidad from './routes/calendario-disponibilidad.routes';
import horarioRouter from './routes/horario.routes';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: '📦 Módulo de Trabajos - Los Vengadores',
    version: '1.0.0',
    description: 'Endpoints para listar trabajos agendados y horarios.',
    endpoints: {
      proveedor: '/api/vengadores/trabajos/proveedor',
      cliente: '/api/vengadores/trabajos/cliente/:clienteId',
      calendarioDisponibilidad: '/api/los_vengadores/calendario-disponibilidad',
      horarios: '/api/los_vengadores/horarios'
    }
  });
});

// Montar rutas
router.use('/', trabajoRoutes);
router.use('/calendario-disponibilidad', disponibilidad);
router.use("/horarios", horarioRouter);

export default router;