import { Router } from "express";
import * as recargaController from "../controllers/recarga.controller";

const router = Router();

// Ruta para crear una recarga
router.post("/", recargaController.crearRecarga);

// Ruta para obtener todas las recargas
router.get("/", recargaController.obtenerRecargas);

export default router;

