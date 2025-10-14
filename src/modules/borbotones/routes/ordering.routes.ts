import {ordenarUsuarios  }  from "../controllers/ordering.controllers";    
import { Router } from 'express';
const router = Router();

// Cambia las rutas para que no repitan "borbotones"
router.get('/orden', ordenarUsuarios);

export default router;