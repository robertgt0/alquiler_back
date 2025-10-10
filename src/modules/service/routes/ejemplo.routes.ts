import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove
} from '../controllers/ejemplo.controller';
import { validateData } from '../middlewares/validate.middleware';

const router = Router();

// Define las rutas de tu módulo aquí
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', validateData, create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;