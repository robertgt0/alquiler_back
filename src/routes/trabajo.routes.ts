import { Router } from "express";
import { trabajoController } from "../controllers/trabajo.controller";

const router = Router();

// CRUD básico
router.get("/", (req, res) => trabajoController.getAll(req, res));
router.get("/:id", (req, res) => trabajoController.getById(req, res));
router.post("/", (req, res) => trabajoController.create(req, res));
router.put("/:id", (req, res) => trabajoController.update(req, res));
router.delete("/:id", (req, res) => trabajoController.delete(req, res));

// Personalizadas
router.get("/estado/:estado", (req, res) => trabajoController.findByEstado(req, res));
router.get("/fixer/:fixerId", (req, res) => trabajoController.findByFixer(req, res));
router.get("/cliente/:clienteId", (req, res) => trabajoController.findByCliente(req, res));

export default router;
