//src/modules/los_vengadores_trabajos/index.ts
import { Router } from 'express';
import ejemploRoutes from './routes/trabajo.routes';
import disponibilidad from './routes/calendario-disponibilidad.routes';
const router = Router();

// Ruta de bienvenida del módulo
router.get('/', (req, res) => {
  res.json({
    message: '📦 Módulo de Ejemplo',
    version: '1.0.0',
    description: 'Este es un módulo de ejemplo para mostrar la estructura',
    endpoints: {
      ejemplo: '/api/nombre_grupo_ejemplo/ejemplo',
      calendarioDisponibilidad: '/api/los_vengadores_trabajos/calendario-disponibilidad'
    }
  });
});

// Montar sub-rutas del módulo
router.use('/ejemplo', ejemploRoutes);

// Puedes agregar más rutas aquí:
// router.use('/otra-ruta', otraRoutes);
router.use('/calendario-disponibilidad', disponibilidad);

export default router;