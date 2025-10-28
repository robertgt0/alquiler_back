// src/modules/notification_Gmail/routes/notification.routes.ts
import { Router } from "express";
import { createNotification } from "../controllers/notification.controller";

const notificationRouter = Router();

/**
 * 📧 Ruta para enviar notificaciones individuales o genéricas
 * POST /notifications
 */
notificationRouter.post("/", createNotification);

export default notificationRouter;
