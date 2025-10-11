import {ordenarEspecialistas  }  from "../controllers/ordering.controllers";    
import { Router } from 'express';
const router = Router();

// Cambia las rutas para que no repitan "borbotones"
router.get('/orden', ordenarEspecialistas);

export default router;