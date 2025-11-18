import { Router } from "express";
import { userAuthController } from "../controllers/userAuth.controller";

const router = Router();

// CRUD básico (BaseController)
router.get("/", (req, res) => userAuthController.getAll(req, res));
router.get("/:id", (req, res) => userAuthController.getById(req, res));
router.post("/", (req, res) => userAuthController.create(req, res));
router.put("/:id", (req, res) => userAuthController.update(req, res));
router.delete("/:id", (req, res) => userAuthController.delete(req, res));

// Ruta personalizada
router.get("/user/:userId", (req, res) => userAuthController.findByUserId(req, res));

export default router;
