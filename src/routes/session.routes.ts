import { Router } from "express";
import { sessionController } from "../controllers/session.controller";

const router = Router();

// CRUD base
router.get("/", (req, res) => sessionController.getAll(req, res));
router.get("/:id", (req, res) => sessionController.getById(req, res));
router.post("/", (req, res) => sessionController.create(req, res));
router.put("/:id", (req, res) => sessionController.update(req, res));
router.delete("/:id", (req, res) => sessionController.delete(req, res));

// Rutas personalizadas
router.get("/user/:userId", (req, res) => sessionController.getActiveByUser(req, res));
router.put("/deactivate/:id", (req, res) => sessionController.deactivateSession(req, res));
router.put("/activity/:id", (req, res) => sessionController.updateActivity(req, res));

export default router;
