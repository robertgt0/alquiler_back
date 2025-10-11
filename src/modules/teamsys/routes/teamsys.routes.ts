import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove
} from '../controllers/teamsys.controller';
import { validateData } from '../middlewares/validate.middleware';

const router = Router();

// Define las rutas de tu módulo aquí

/**obtener todos los resultados */
router.get('/', getAll);
/*obtener un usr por id */
router.get('/:id', getById);
/*crear un nuevo usuario */
router.post('/', validateData, create);
/**actualizar un usr existente */
router.put('/:id', update);
/**eliminar un usr por id */
router.delete('/:id', remove);

export default router;