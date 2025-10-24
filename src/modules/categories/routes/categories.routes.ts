import { Router } from "express";
import service from "../services/categories.service";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ success: true, data: service.list() });
});

router.post("/", (req, res) => {
  try {
    const { name } = req.body || {};
    const created = service.create(name);
    res.status(201).json({ success: true, data: created, message: "Su tipo de trabajo fue registrado con éxito" });
  } catch (err: any) {
    const msg = String(err?.message || "Error");
    const code = /existe|inválidas?|vacío|Mínimo|Máximo|Solo/.test(msg) ? 400 : 500;
    res.status(code).json({ success: false, message: msg });
  }
});

export default router;
