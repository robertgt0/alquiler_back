import { Router } from 'express';
import teamsysRoutes from './routes/teamsys.routes';
//import router from './routes/teamsys.routes';

const router = Router();

// Ruta de bienvenida del módulo
router.get('/', (req, res) => {
  res.json({
    message: '📦 Módulo de Ejemplo',
    version: '1.0.0',
    description: 'Este es un módulo de ejemplo para mostrar la estructura',
    endpoints: {
      ejemplo: '/api/teamsys/ejemploteamsys'
    }
  });
});

// Montar sub-rutas del módulo
router.use('/', teamsysRoutes);

// Puedes agregar más rutas aquí:
// router.use('/otra-ruta', otraRoutes);

export default router;