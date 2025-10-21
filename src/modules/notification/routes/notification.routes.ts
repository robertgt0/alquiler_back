// src/modules/notifications/routes/notification.routes.ts
import { Router } from 'express';
import { createNotification } from "../controllers/notification.controller";
const router = Router();

// POST /api/notify   -> crea y procesa una notificación
router.post('/', createNotification);

export default router;

