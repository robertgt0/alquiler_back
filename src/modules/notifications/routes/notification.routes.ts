// src/modules/notifications/routes/notification.routes.ts
import { Router } from 'express';
import { createNotification, testWebhook } from '../controllers/notification.controller';

const router = Router();

// POST /api/notify   -> crea y procesa una notificación
router.post('/', createNotification);

// POST /api/notify/webhook-test  -> opcional: endpoint que reenvía a n8n (ejemplo)
router.post('/webhook-test', testWebhook);

export default router;

