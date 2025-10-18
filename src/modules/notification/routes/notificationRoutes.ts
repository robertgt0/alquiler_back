/*
Esto deben modificarlo en base a lo que estamos haciendo de notificaciones
LO QUE ESTA AQUI PARECE SER ALGO GENERICO!!! atte:Adrian
*/
/*
import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove
} from '../controllers/notificationController';
import { validateData } from '../middlewares/validate.middleware';

const router = Router();

// Define las rutas de tu módulo aquí
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', validateData, create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
*/
// src/modules/notification/routes/notificationRoutes.ts
import { Router } from 'express';
import { createNotification, listNotifications } from '../controllers/notificationController';

const router = Router();

router.post('/', createNotification);
router.get('/', listNotifications);

export default router;
