import { Router } from 'express';

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


export default router;