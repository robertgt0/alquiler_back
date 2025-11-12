import { Router } from 'express';
import { obtenerUbicaciones, crearUbicacion } from '../controllers/ubicacionController';

const router = Router();

// Ruta para obtener todas las ubicaciones
router.get('/ubicaciones', obtenerUbicaciones);

// Ruta para crear una nueva ubicación
router.post('/ubicaciones', crearUbicacion);

export default router;