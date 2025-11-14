import { Router } from "express";
import { especialidadController } from "../controllers/especialidad.controller";

const router = Router();

// CRUD base
router.get("/", (req, res) => especialidadController.getAll(req, res));
router.get("/:id", (req, res) => especialidadController.getById(req, res));
router.post("/", (req, res) => especialidadController.create(req, res));
router.put("/:id", (req, res) => especialidadController.update(req, res));
router.delete("/:id", (req, res) => especialidadController.delete(req, res));

// Extra: buscar por nombre
router.get("/buscar/:nombre", (req, res) => especialidadController.findByNombre(req, res));

export default router;
