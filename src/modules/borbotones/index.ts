import { Router } from 'express';
import ejemploRoutes from './routes/ejemplo.routes';

const router = Router();

// Ruta de bienvenida del módulo
router.get('/', (req, res) => {
  res.json({
    message: '📦 Módulo de Ejemplo',
    version: '1.0.0',
    description: 'Este es un módulo de ejemplo para mostrar la estructura',
    endpoints: {
      ejemplo: '/api/nombre_grupo_ejemplo/ejemplo'
    }
  });
});

// Montar sub-rutas del módulo
router.use('/ejemplo', ejemploRoutes);

// Puedes agregar más rutas aquí:
// router.use('/otra-ruta', otraRoutes);

export default router;