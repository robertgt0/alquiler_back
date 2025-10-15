import { Router } from "express";
import {
  createFixer,
  updateFixer,
  getFixer,
  updateFixerCategories, // 👈 nuevo handler
} from "../controllers/fixers.controller";

const router = Router();

router.post("/", createFixer);
router.put("/:id", updateFixer);
router.get("/:id", getFixer);

// 👇 NUEVA RUTA: guardar categorías seleccionadas para un fixer
router.put("/:id/categories", updateFixerCategories);

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    module: "fixer",
    endpoints: ["POST /", "GET /:id", "PUT /:id", "PUT /:id/categories"],
  });
});

export default router;
