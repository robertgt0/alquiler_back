import { Router } from 'express';
import { searchAutocomplete } from '../controllers/busqueda.controller';
import {
  getSearchHistory,
  clearSearchHistory,
} from '../controllers/historial.controller';

const router = Router();

// Buscar (autocompletado contextual)
// http://localhost:5000/api/borbotones/search/autocomplete?q=Limpieza profunda

router.get('/autocomplete', searchAutocomplete);

// Ver historial
// GET http://localhost:5000/api/borbotones/search/history
router.get('/history', getSearchHistory);

//  Limpiar historial
// DELETE http://localhost:5000/api/borbotones/search/history
router.delete('/history', clearSearchHistory);

export default router;


