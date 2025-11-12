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
  getAuthById,
  cambiarContraseña
} from '../controllers/teamsys.controller';
import { validateData } from '../middlewares/validate.middleware';
import { authController } from '../controllers/auth.controller';
import { registerUser, loginUser } from '../controllers/teamsys.controller';
//import { UsuarioService } from '../services/teamsys.service';

import { sessionController } from '../controllers/session.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { magicLinkController } from '../controllers/magic-link.controller';
import { twofactorController } from '../controllers/twofactor.controller';

const router = Router();

// === RUTAS DE AUTENTICACIÓN ===
router.post('/auth/register', validateData, registerUser);
router.post('/auth/login', loginUser);
router.post("/google/callback", authController.googleCallback);
router.get("/me", authMiddleware, authController.getCurrentUser);
//h4
router.post('/magic-link/request', magicLinkController.requestMagicLink);
//router.get('/magic-link/verify', magicLinkController.verifyMagicLink);
router.post('/magic-link/verify', magicLinkController.verifyMagicLink);


// === RUTAS DE SESIONES ===
/**
 * sessions routes
 */
router.get("/sessions/user/:userId", authMiddleware, sessionController.getSessionsByUserId);
router.delete("/sessions/:sessionId/", authMiddleware, sessionController.deleteSession);
router.delete("/sessions/user/all-except-current", authMiddleware, sessionController.deleteAllSessionsExceptCurrent);

// === RUTAS DE USUARIO ESPECÍFICAS ===
//import { registerUser, loginUser} from '../controllers/teamsys.controller';
//router.put('/usuario/cambiar-contraseña', authMiddleware, cambiarContraseña);
// En routes/teamsys.routes.ts - Temporalmente
router.put('/usuario/cambiar-contrasena', authMiddleware, cambiarContraseña);

// === RUTAS CRUD DE USUARIO ===
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
//router.delete("/sessions/user/all-except-current", authMiddleware, sessionController.deleteAllSessionsExceptCurrent);

router.post("/2fa/setup", authMiddleware, twofactorController.setupTwoFactor);
router.post("/2fa/verify", authMiddleware, twofactorController.verifyAndEnable);
router.post("/2fa/disable", authMiddleware, twofactorController.disableTwoFactor);
router.post("/2fa/verify-login", twofactorController.verifyLoginToken);

export default router;