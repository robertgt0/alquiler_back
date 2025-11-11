import { Router } from "express";
import {
  buscarPorServicio,
  buscarPorDisponibilidad,
  buscarPorZona,
  buscarPorAnosExperiencia,
  buscarPorRangoPrecio,
  buscarPorFechaCreacion
} from "../controllers/busquedaAvanzada.controller";

const router = Router();

// ENDPOINT 1: Búsqueda por servicio con filtros adicionales
// GET http://localhost:5000/api/borbotones/search/avanzada/servicios?servicio=Reparación
router.get("/servicios", buscarPorServicio);

// ENDPOINT 2: Búsqueda por disponibilidad horaria
// GET http://localhost:5000/api/borbotones/search/avanzada/disponibilidad?turno=Tarde
router.get("/disponibilidad", buscarPorDisponibilidad);

// ENDPOINT 3: Búsqueda por zona/ubicación
// GET http://localhost:5000/api/borbotones/search/avanzada/zona?zona=Norte
router.get("/zona", buscarPorZona);

// ENDPOINT 4: Búsqueda por años de experiencia
// GET http://localhost:5000/api/borbotones/search/avanzada/experiencia?años=4 Profesionales con exactamente 4 años de experiencia
// GET http://localhost:5000/api/borbotones/search/avanzada/experiencia?años_min=5 Profesionales con 5 o más años de experiencia
// GET http://localhost:5000/api/borbotones/search/avanzada/experiencia?años_max=3 Profesionales con hasta 3 años de experiencia
router.get('/experiencia', buscarPorAnosExperiencia);

// ENDPOINT 5: Búsqueda por rango de precio
// GET http://localhost:5000/api/borbotones/search/avanzada/precio?precio_min=50 Servicios con precio base de 50 o más.
// GET http://localhost:5000/api/borbotones/search/avanzada/precio?precio_max=100 Servicios con precio base de 100 o menos 
// GET http://localhost:5000/api/borbotones/search/avanzada/precio?precio_min=30&precio_max=80 Servicios con precios entre 30 y 80.
router.get('/precio', buscarPorRangoPrecio);

// ENDPOINT 6: Búsqueda por fecha de creación del servicio
// GET http://localhost:5000/api/borbotones/search/avanzada/fecha?fecha_exacta=2024-01-10
router.get('/fecha', buscarPorFechaCreacion);


export default router;
