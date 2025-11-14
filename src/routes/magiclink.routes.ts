import { Router } from "express";
import { magicLinkController } from "../controllers/magiclink.controller";

const router = Router();

// CRUD base
router.get("/", (req, res) => magicLinkController.getAll(req, res));
router.get("/:id", (req, res) => magicLinkController.getById(req, res));
router.post("/", (req, res) => magicLinkController.create(req, res));
router.put("/:id", (req, res) => magicLinkController.update(req, res));
router.delete("/:id", (req, res) => magicLinkController.delete(req, res));

// Personalizados
router.get("/token/:token", (req, res) => magicLinkController.findByToken(req, res));
router.put("/use/:token", (req, res) => magicLinkController.markAsUsed(req, res));
router.delete("/clean/expired", (req, res) => magicLinkController.cleanExpired(req, res));

export default router;
