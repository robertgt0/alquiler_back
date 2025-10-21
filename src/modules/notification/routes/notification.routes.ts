<<<<<<< HEAD
import { Router } from "express";
import {
  createNotificationHandler,
  getNotificationHandler,
  listNotificationsHandler,
  sendBookingTemplateHandler, // 👈 añade este import
} from "../controllers/notification.controller"; // ✅ corregida la ruta (antes apuntaba mal)
import { createNotificationValidators } from "../dtos/createNotification.dto";
=======
// src/modules/notifications/routes/notification.routes.ts
import { Router } from 'express';
import { createNotification, testWebhook } from '../controllers/notification.controller';
>>>>>>> origin/dev/recode

const router = Router();

// POST /api/notify   -> crea y procesa una notificación
router.post('/', createNotification);

// POST /api/notify/webhook-test  -> opcional: endpoint que reenvía a n8n (ejemplo)
router.post('/webhook-test', testWebhook);

// 👇 NUEVA RUTA (T12)
router.post("/booking-template", sendBookingTemplateHandler);

export default router;

