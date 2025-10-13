import { Router } from "express";
import { createFixer, updateFixer, getFixer } from "../controllers/fixers.controller"; // en plural


const router = Router();
router.post("/", createFixer);
router.put("/:id", updateFixer);
router.get("/:id", getFixer);
router.get("/", (_req, res) => {
  res.json({ ok: true, module: "fixer", endpoints: ["POST /", "GET /:id", "PUT /:id"] });
});

export default router;

