// routes/cliente.routes.ts
import { Router } from "express";
import { clienteController } from "../controllers/cliente.controller";

const router = Router();

// CRUD básico (heredado del BaseController)
router.get("/", (req, res) => clienteController.getAll(req, res));
router.get("/:id", (req, res) => clienteController.getById(req, res));
router.post("/", (req, res) => clienteController.create(req, res));
router.put("/:id", (req, res) => clienteController.update(req, res));
router.delete("/:id", (req, res) => clienteController.delete(req, res));

// Rutas personalizadas del módulo Cliente
router.get("/correo/:correo", (req, res) => clienteController.findByCorreo(req, res));

export default router;
