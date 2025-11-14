import { Router } from "express";
import { ciudadController } from "../controllers/ciudad.controller";

const router = Router();

// CRUD base
router.get("/", (req, res) => ciudadController.getAll(req, res));
router.get("/:id", (req, res) => ciudadController.getById(req, res));
router.post("/", (req, res) => ciudadController.create(req, res));
router.put("/:id", (req, res) => ciudadController.update(req, res));
router.delete("/:id", (req, res) => ciudadController.delete(req, res));

// Extra
router.get("/buscar/nombre/:nombre", (req, res) =>
  ciudadController.findByNombre(req, res)
);

export default router;
