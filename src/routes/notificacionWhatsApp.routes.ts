import { Router } from "express";
import { notificacionWhatsAppController } from "../controllers/notificacionWhatsApp.controller";

const router = Router();

// CRUD base
router.get("/", (req, res) => notificacionWhatsAppController.getAll(req, res));
router.get("/:id", (req, res) => notificacionWhatsAppController.getById(req, res));
router.post("/", (req, res) => notificacionWhatsAppController.create(req, res));
router.put("/:id", (req, res) => notificacionWhatsAppController.update(req, res));
router.delete("/:id", (req, res) => notificacionWhatsAppController.delete(req, res));

// Personalizados
router.get("/status/:status", (req, res) =>
  notificacionWhatsAppController.findByStatus(req, res)
);
router.get("/transaction/:transactionId", (req, res) =>
  notificacionWhatsAppController.findByTransaction(req, res)
);

export default router;
