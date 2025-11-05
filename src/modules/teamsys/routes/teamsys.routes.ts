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
import { sessionController } from '../controllers/session.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { twofactorController } from '../controllers/twofactor.controller';

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
router.get("/me", authMiddleware, authController.getCurrentUser);


/**
 * sessions routes
 */
router.get("/sessions/user/:userId", authMiddleware, sessionController.getSessionsByUserId);
router.delete("/sessions/:sessionId/", authMiddleware, sessionController.deleteSession);
router.delete("/sessions/user/all-except-current", authMiddleware, sessionController.deleteAllSessionsExceptCurrent);

router.post("/2fa/setup", authMiddleware, twofactorController.setupTwoFactor);
router.post("/2fa/verify", authMiddleware, twofactorController.verifyAndEnable);
router.post("/2fa/disable", authMiddleware, twofactorController.disableTwoFactor);
router.post("/2fa/verify-login", twofactorController.verifyLoginToken);
router.get("/2fa/status", authMiddleware, twofactorController.getTwoFactorStatus);

export default router;