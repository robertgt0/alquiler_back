import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  existsByEmail,
  actualizarAutentificacion,
  agregarAutentificacion,
  eliminarAutentificacion,
  updateMapa,
  updateTelefono,
  getAuthById
} from '../controllers/teamsys.controller';
import { validateData } from '../middlewares/validate.middleware';
import { authController } from '../controllers/auth.controller';
import { registerUser, loginUser } from '../controllers/teamsys.controller';
//import { UsuarioService } from '../services/teamsys.service';

import { sessionController } from '../controllers/session.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

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
router.post('/auth-Method/:id',agregarAutentificacion);
router.delete('/auth-Method/:id',eliminarAutentificacion);
router.get('/auth-Method/:id',getAuthById);
router.post('/usuario/telefono/:id',updateTelefono);
router.post('/usuario/ubicacion/:id',updateMapa);
router.post("/google/callback", authController.googleCallback);
router.get("/me", authMiddleware, authController.getCurrentUser);


/**
 * sessions routes
 */
router.get("/sessions/user/:userId", authMiddleware, sessionController.getSessionsByUserId);
router.delete("/sessions/:sessionId/", authMiddleware, sessionController.deleteSession);
router.delete("/sessions/user/all-except-current", authMiddleware, sessionController.deleteAllSessionsExceptCurrent);

export default router;