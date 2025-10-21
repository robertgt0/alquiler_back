import { Router } from "express";
import { createNotification, sendBookingTemplateHandler } from "../controllers/notification.controller";

const router = Router();

// POST /api/notify -> flujo principal centralizado
router.post("/", createNotification);

// POST /api/notify/booking-template -> prueba del template T12
router.post("/booking-template", sendBookingTemplateHandler);

export default router;