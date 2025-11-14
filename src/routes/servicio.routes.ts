import { Router } from "express";
import { servicioController } from "../controllers/servicio.controller";

const router = Router();

// CRUD básico
router.get("/", (req, res) => servicioController.getAll(req, res));
router.get("/:id", (req, res) => servicioController.getById(req, res));
router.post("/", (req, res) => servicioController.create(req, res));
router.put("/:id", (req, res) => servicioController.update(req, res));
router.delete("/:id", (req, res) => servicioController.delete(req, res));

// Personalizadas
router.get("/proveedor/:proveedorId", (req, res) => servicioController.findByProveedor(req, res));
router.get("/buscar", (req, res) => servicioController.searchByNombre(req, res));
router.get("/estadisticas/rating", (req, res) => servicioController.promedioRating(req, res));

export default router;
