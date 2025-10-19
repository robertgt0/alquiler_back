import { Router } from "express";
import {
  createNotificationHandler,
  getNotificationHandler,
  listNotificationsHandler,
} from "../middlewares/notification.controller"; // ✅ corregida la ruta (antes apuntaba mal)
import { createNotificationValidators } from "../dtos/createNotification.dto";

// ✅ Creamos el router principal
const router = Router();

/**
 * POST /notifications
 * Crea una nueva notificación.
 * Usa los validadores definidos en createNotification.dto.ts
 * y luego el controlador que usa Gmail API (no SMTP)
 */
router.post("/", createNotificationValidators, createNotificationHandler);

/**
 * GET /notifications/:id
 * Obtiene una notificación específica por ID
 */
router.get("/:id", getNotificationHandler);

/**
 * GET /notifications
 * Lista todas las notificaciones registradas (en logs o DB)
 */
router.get("/", listNotificationsHandler);

export default router;
