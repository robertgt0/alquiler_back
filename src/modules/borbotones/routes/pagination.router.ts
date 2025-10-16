import { Router } from 'express';
import {
  getUsuariosPaginados
} from '../controllers/pagination.controller';

const router = Router();

// Cambia las rutas para que no repitan "borbotones"
//http://localhost:5000/api/borbotones/usuarios?limit=40 (Los 40 resultados)
//http://localhost:5000/api/borbotones/usuarios??page=2  (Pagina 2)
//http://localhost:5000/api/borbotones/usuarios??page=2  (Pagina 3)
//http://localhost:5000/api/borbotones/usuarios??page=2  (Pagina 4)
router.get('/usuarios', getUsuariosPaginados);

export default router;