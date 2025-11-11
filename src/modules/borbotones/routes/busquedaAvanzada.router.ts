import { Router } from "express";
import {
  buscarPorServicio,
  buscarPorDisponibilidad,
  buscarPorZona
} from "../controllers/busquedaAvanzada.controller";

const router = Router();

// ENDPOINT 1: Búsqueda por servicio con filtros adicionales
// GET http://localhost:5000/api/borbotones/search/avanzada/servicios?servicio=Reparación
router.get("/avanzada/servicios", buscarPorServicio);

// ENDPOINT 2: Búsqueda por disponibilidad horaria
// GET http://localhost:5000/api/borbotones/search/avanzada/disponibilidad?turno=Tarde
router.get("/avanzada/disponibilidad", buscarPorDisponibilidad);

// ENDPOINT 3: Búsqueda por zona/ubicación
// GET http://localhost:5000/api/borbotones/search/avanzada/zona?zona=Norte
router.get("/avanzada/zona", buscarPorZona);

export default router;
