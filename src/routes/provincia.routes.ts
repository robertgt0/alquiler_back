import { Router } from "express";
import { provinciaController } from "../controllers/provincia.controller";

const router = Router();

// CRUD base
router.get("/", (req, res) => provinciaController.getAll(req, res));
router.get("/:id", (req, res) => provinciaController.getById(req, res));
router.post("/", (req, res) => provinciaController.create(req, res));
router.put("/:id", (req, res) => provinciaController.update(req, res));
router.delete("/:id", (req, res) => provinciaController.delete(req, res));

// Extra
router.get("/ciudad/:id_ciudad", (req, res) =>
  provinciaController.findByCiudad(req, res)
);

export default router;
