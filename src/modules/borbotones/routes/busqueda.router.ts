import { Router } from "express";
import { searchAutocomplete } from "../controllers/busqueda.controller";
import { getSearchHistory, clearSearchHistory } from "../controllers/historial.controller";
import {
  serviciosAvanzada,
  disponibilidadAvanzada,
  zonaAvanzada,
  experienciaAvanzada,
  precioAvanzada,
  fechaAvanzada,
} from "../controllers/searchAvanzada.controller";

const router = Router();

// Buscar (autocompletado contextual)
// http://localhost:5000/api/borbotones/search/autocomplete?q=Limpieza profunda
router.get("/autocomplete", searchAutocomplete);

// Ver historial
// GET http://localhost:5000/api/borbotones/search/history
router.get("/history", getSearchHistory);

// Limpiar historial
// DELETE http://localhost:5000/api/borbotones/search/history
router.delete("/history", clearSearchHistory);

// Rutas para búsqueda avanzada (endpoints mínimos para la UI)
// Base: /api/borbotones/search/avanzada
router.get("/avanzada/servicios", serviciosAvanzada);
router.get("/avanzada/disponibilidad", disponibilidadAvanzada);
router.get("/avanzada/zona", zonaAvanzada);
router.get("/avanzada/experiencia", experienciaAvanzada);
router.get("/avanzada/precio", precioAvanzada);
router.get("/avanzada/fecha", fechaAvanzada);

export default router;


