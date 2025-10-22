// src/modules/los_vengadores_trabajos/routes/horario.routes.ts
import { Router } from "express";
import { getHorariosPorFecha, crearHorario, eliminarHorario, actualizarHorario } from "../controllers/horario.controller";

const router = Router();

// GET horarios por fecha
router.get("/horarios/:fecha", getHorariosPorFecha);

// POST crear nuevo horario
router.post("/horarios", crearHorario);

// DELETE crear eliminar horario
router.delete("/horarios/:id", eliminarHorario);

// PUT modificar horario
router.put("/horarios/:id", actualizarHorario);

export default router;
