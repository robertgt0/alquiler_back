import { Router } from "express";
import { fixerController } from "../controllers/fixer.controller";

const router = Router();

// CRUD base (heredado de BaseController)
router.get("/", (req, res) => fixerController.getAll(req, res));
router.get("/:id", (req, res) => fixerController.getById(req, res));
router.post("/", (req, res) => fixerController.create(req, res));
router.put("/:id", (req, res) => fixerController.update(req, res));
router.delete("/:id", (req, res) => fixerController.delete(req, res));

// Rutas personalizadas
router.get("/email/:email", (req, res) => fixerController.findByEmail(req, res));
router.patch("/:id/disponibilidad", (req, res) =>
  fixerController.actualizarDisponibilidad(req, res)
);

export default router;
