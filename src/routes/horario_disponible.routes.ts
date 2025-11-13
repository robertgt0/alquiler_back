import { Router } from "express";
import { horarioDisponibleController } from "../controllers/horario_disponible.controller";

const router = Router();

// CRUD base
router.get("/", (req, res) => horarioDisponibleController.getAll(req, res));
router.get("/:id", (req, res) => horarioDisponibleController.getById(req, res));
router.post("/", (req, res) => horarioDisponibleController.create(req, res));
router.put("/:id", (req, res) => horarioDisponibleController.update(req, res));
router.delete("/:id", (req, res) => horarioDisponibleController.delete(req, res));

// Personalizadas
router.get("/proveedor/:proveedorId", (req, res) =>
  horarioDisponibleController.findByProveedor(req, res)
);

router.get("/buscar/fecha", (req, res) =>
  horarioDisponibleController.findByFecha(req, res)
);

router.post("/verificar", (req, res) =>
  horarioDisponibleController.verificarDisponibilidad(req, res)
);

export default router;
