import { Router } from "express";
import { notificarSaldoBajo } from "../controllers/notificacion.controller";

const router = Router();

router.post("/saldo-bajo", notificarSaldoBajo);

export default router;
