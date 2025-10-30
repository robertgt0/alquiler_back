// src/modules/notification_Gmail/routes/central.router.ts
import { Router } from "express";
import { receiveNotificationHandler } from "../controllers/central.controller";

const centralRouter = Router();

/**
 * 📩 Ruta principal para recibir notificaciones centralizadas
 * POST /api/notifications
 */
centralRouter.post("/", receiveNotificationHandler);

export default centralRouter;
