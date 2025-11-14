import { Router } from "express";
import { notificacionGmailController } from "../controllers/notificacionGmail.controller";

const router = Router();

// CRUD base
router.get("/", (req, res) => notificacionGmailController.getAll(req, res));
router.get("/:id", (req, res) => notificacionGmailController.getById(req, res));
router.post("/", (req, res) => notificacionGmailController.create(req, res));
router.put("/:id", (req, res) => notificacionGmailController.update(req, res));
router.delete("/:id", (req, res) => notificacionGmailController.delete(req, res));

// Personalizados
router.get("/status/:status", (req, res) =>
  notificacionGmailController.findByStatus(req, res)
);
router.get("/transaction/:transactionId", (req, res) =>
  notificacionGmailController.findByTransaction(req, res)
);

export default router;
