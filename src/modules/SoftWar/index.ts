import { Router } from 'express';
import categoryRoutes from './routes/category.routes'; // 👈 Importa las rutas

const router = Router();

// Ruta de bienvenida del módulo (opcional)
router.get('/', (req, res) => {
  res.json({
    message: '📦 Módulo SoftWar',
    description: 'Endpoints para categorías y servicios.',
    endpoints: {
      categories: '/api/softwar/categories'
    }
  });
});

// Montar sub-rutas del módulo
router.use('/categories', categoryRoutes); // 👈 Registra las rutas

export default router;