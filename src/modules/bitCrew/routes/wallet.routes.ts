
import { Router } from 'express';
// Importamos las dos funciones del controlador
import { 
  handleGetBilleteraByUsuario, 
  handleGetBilleteraTmolina 
} from '../controllers/wallet.controller';

const router = Router();

// --- RUTA DE PRUEBA "HARCODED" ---
// Antes era: /billetera-tmolina
// Ahora es: /tmolina-test
// URL completa: /api/bitcrew/billetera/tmolina-test
router.get('/tmolina-test', handleGetBilleteraTmolina);


// --- RUTA DINÁMICA (La que ya tenías) ---
// Antes era: /billetera/:usuario
// Ahora es: /:usuario
// URL completa: /api/bitcrew/billetera/tmolina
router.get('/:usuario', handleGetBilleteraByUsuario);


export default router;