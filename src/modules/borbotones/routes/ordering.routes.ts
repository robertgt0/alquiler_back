import {ordenarUsuarios  }  from "../controllers/ordering.controllers";    
import { Router } from 'express';
const router = Router();

// Cambia las rutas para que no repitan "borbotones"

// Rutas de la historia de usuario de ordenamiento por criterios basicos.  
// localhost:5000/api/borbotones/orden?orden=nombre_A-Z
// localhost:5000/api/borbotones/orden?orden=nombre_Z-A
// localhost:5000/api/borbotones/orden?orden=fecha
// localhost:5000/api/borbotones/orden?orden=calificacion
router.get('/orden', ordenarUsuarios);

export default router;