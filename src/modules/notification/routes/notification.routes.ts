/*
Esto deben modificarlo en base a lo que estamos haciendo de notificaciones
LO QUE ESTA AQUI PARECE SER ALGO GENERICO!!! atte:Adrian
*/


import { Router } from "express";

import {
  createNotificationHandler,
  getNotificationHandler,
  listNotificationsHandler,
} from "../../notification/controllers/notification.controller";

import { createNotificationValidators } from "../dtos/createNotification.dto";

const router = Router();

router.post("/", createNotificationValidators, createNotificationHandler);
router.get("/:id", getNotificationHandler);
router.get("/", listNotificationsHandler);

export default router;