// src/modules/los_vengadores_trabajos/routes/horario.routes.ts
import { Router } from "express";
import { getHorariosPorFecha, crearHorario, eliminarHorario, actualizarHorario } from "../controllers/horario_disponible.controller";

const router = Router();

// GET horarios por fecha
router.get("/:fecha", getHorariosPorFecha);

// POST crear nuevo horario
router.post("/", crearHorario);

// DELETE crear eliminar horario
router.delete("/:id", eliminarHorario);

// PUT modificar horario
router.put("/:id", actualizarHorario);

export default router;
