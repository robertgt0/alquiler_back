import { Router } from "express";
import { walletController } from "../controllers/wallet.controller";

const router = Router();

// CRUD básico
router.get("/", (req, res) => walletController.getAll(req, res));
router.get("/:id", (req, res) => walletController.getById(req, res));
router.post("/", (req, res) => walletController.create(req, res));
router.put("/:id", (req, res) => walletController.update(req, res));
router.delete("/:id", (req, res) => walletController.delete(req, res));

// Personalizadas
router.get("/fixer/:fixerId", (req, res) => walletController.findByFixer(req, res));
router.put("/fixer/:fixerId/saldo", (req, res) => walletController.actualizarSaldo(req, res));
router.put("/fixer/:fixerId/estado", (req, res) => walletController.cambiarEstado(req, res));

export default router;
