import { Router } from "express";
import { historialController } from "../controllers/historial.controller";

const router = Router();

// CRUD base
router.get("/", (req, res) => historialController.getAll(req, res));
router.get("/:id", (req, res) => historialController.getById(req, res));
router.post("/", (req, res) => historialController.create(req, res));
router.put("/:id", (req, res) => historialController.update(req, res));
router.delete("/:id", (req, res) => historialController.delete(req, res));

// Extra: buscar por usuario
router.get("/usuario/:id_usuario", (req, res) =>
  historialController.findByUsuario(req, res)
);

export default router;
