import { Router } from "express";
import { citaController } from "../controllers/cita.controller";

const router = Router();

// CRUD base
router.get("/", (req, res) => citaController.getAll(req, res));
router.get("/:id", (req, res) => citaController.getById(req, res));
router.post("/", (req, res) => citaController.create(req, res));
router.put("/:id", (req, res) => citaController.update(req, res));
router.delete("/:id", (req, res) => citaController.delete(req, res));

// Personalizadas
router.get("/cliente/:clienteId", (req, res) => citaController.findByCliente(req, res));
router.get("/proveedor/:proveedorId", (req, res) => citaController.findByProveedor(req, res));
router.patch("/:id/estado", (req, res) => citaController.updateEstado(req, res));
router.get("/buscar/fecha", (req, res) => citaController.findByFecha(req, res));

export default router;
