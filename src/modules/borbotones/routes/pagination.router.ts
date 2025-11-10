import { Router } from 'express';
import {
  getUsuariosPaginados, validarPaginaExistente
} from '../controllers/pagination.controller';

const router = Router();

// Cambia las rutas para que no repitan "borbotones"
//http://localhost:5000/api/borbotones/usuarios?limit=40 (Los 40 resultados)
//http://localhost:5000/api/borbotones/usuarios??page=2  (Pagina 2)
//http://localhost:5000/api/borbotones/usuarios??page=2  (Pagina 3)
//http://localhost:5000/api/borbotones/usuarios??page=2  (Pagina 4)
router.get('/usuarios', getUsuariosPaginados);
/*
  Endpoint: GET /api/usuarios/validar-pagina

  Parámetros:
    paginaGuardada (obligatorio): La página que quieres validar
    limit: Límite de items por página (debe coincidir con el original)
    Todos los mismos filtros que usaste originalmente

    ejemplos: 
      Validar si la página 5 sigue existiendo con los mismos filtros
        /api/usuarios/validar-pagina?paginaGuardada=5&limit=10&ciudad=La Paz
      Validar con múltiples filtros
        /api/usuarios/validar-pagina?paginaGuardada=3&limit=10&especialidad=Electricidad&zona=Norte&precio_min=100
        
    Respuesta:
      {
        "success": true,
        "data": {
        "paginaGuardada": 5,
        "paginaExiste": false,
        "paginaAjustada": 1,
        "totalPages": 3,
        "totalItems": 25,
        "itemsPerPage": 10,
        "necesitaAjuste": true
      }
*/
router.get('/usuarios/validar-pagina', validarPaginaExistente)
export default router;