import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  existsByEmail
} from '../controllers/teamsys.controller';
import { validateData } from '../middlewares/validate.middleware';
import { authController } from '../controllers/auth.controller';
import { registerUser, loginUser } from '../controllers/teamsys.controller';
import { UsuarioService } from '../services/teamsys.service';


const router = Router();

// Define las rutas de tu módulo aquí

/**obtener todos los resultados */
router.get('/usuario', getAll);
/*obtener un usr por id */
router.get('/usuario/:id', getById);
/*crear un nuevo usuario */
router.post('/usuario', validateData, create);
/**actualizar un usr existente */
router.put('/usuario/:id', update);
/**eliminar un usr por id */
router.delete('/usuario/:id', remove);
router.post('/auth/register', validateData, registerUser);
router.post('/auth/login', loginUser);
router.get('/exists', existsByEmail);
/**
 * Auth routes
 */
router.post("/google/callback", authController.googleCallback);
router.get("/me", authController.getCurrentUser);

export default router;