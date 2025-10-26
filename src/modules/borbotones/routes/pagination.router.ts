import { Router } from 'express';
import {
  getUsuariosPaginados
  , getUsuarioById
} from '../controllers/pagination.controller';

const router = Router();


// http://localhost:5000/api/borbotones/usuarios?page=1 (Por defecto 10 resultados)
// http://localhost:5000/api/borbotones/usuarios?page=1&limit=15 (Pagina 1 con 15 resultados)
router.get('/usuarios', getUsuariosPaginados);
router.get('/usuarios/:id', getUsuarioById);

export default router;