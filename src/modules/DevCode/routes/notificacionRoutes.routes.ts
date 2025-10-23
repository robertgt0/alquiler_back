import { Router } from "express";
import * as notificacionController from "../controllers/notificacionController.controller";

const router = Router();

router.post("/", notificacionController.createNotificacion);
router.get("/", notificacionController.getNotificaciones);
router.get("/:id", notificacionController.getNotificacionById);
router.put("/:id", notificacionController.updateNotificacion);
router.delete("/:id", notificacionController.deleteNotificacion);

export default router;
