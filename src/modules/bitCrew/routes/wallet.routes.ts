import { Router } from 'express';

//  IMPORTAMOS EL CONTROLADOR
import * as billeteraController from '../controllers/wallet.controller';

const router = Router();

// Ruta dinámica para obtener billetera por nombre de usuario
router.get(
  '/:usuario', 
  billeteraController.handleGetBilleteraByUsuario
);

export default router;
