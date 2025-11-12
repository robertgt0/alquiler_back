import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  existsByEmail,
  registerUser, 
  loginUser,
  debugGoogleAuth,    // NUEVO
  testGoogleAuth,     // NUEVO
  googleCallback      // NUEVO
} from '../controllers/teamsys.controller';
import { validateData } from '../middlewares/validate.middleware';
import { authController } from '../controllers/auth.controller';

const router = Router();

// Define las rutas de tu módulo aquí

// 🔐 NUEVAS RUTAS DE GOOGLE AUTH (PARA DEBUG)
router.post('/google/debug', debugGoogleAuth);      // Endpoint de debug
router.post('/google/test', testGoogleAuth);        // Endpoint de test simple
router.post('/google/callback', googleCallback);    // Callback principal

// 📋 RUTAS EXISTENTES DE USUARIOS
router.get('/usuario', getAll);
router.get('/usuario/:id', getById);
router.post('/usuario', validateData, create);
router.put('/usuario/:id', update);
router.delete('/usuario/:id', remove);
router.post('/auth/register', validateData, registerUser);
router.post('/auth/login', loginUser);
router.get('/exists', existsByEmail);

/**
 * Auth routes (manteniendo compatibilidad)
 */
router.post("/auth/google/callback", authController.googleCallback); // Ruta alternativa
router.get("/auth/me", authController.getCurrentUser);

export default router;