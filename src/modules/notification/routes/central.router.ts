// src/modules/notifications/routes/central.router.ts
import { Router } from "express";
import { receiveNotificationHandler } from "../controllers/central.controller";

const router = Router();

// POST /api/notifications
router.post("/", receiveNotificationHandler);

export default router;
