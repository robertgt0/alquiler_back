import { Router } from "express";
import { getTrabajoCanceladoById } from "../controllers/trabajo-terminado.controller";

const router = Router();

// Ejemplo de prueba temporal
router.get("/ping", (_req, res) => res.json({ ok: true, where: "trabajo-cancelado" }));

// Endpoint real
router.get("/:id", getTrabajoCanceladoById);

export default router;
