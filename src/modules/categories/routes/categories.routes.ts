import { Router } from "express";
import service from "../services/categories.service";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const list = await service.list();
    res.json({ success: true, data: list });
  } catch (error) {
    console.error("Error al listar categorias", error);
    res.status(500).json({ success: false, message: "No se pudieron obtener las categorias" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body || {};
    const created = await service.create(name, description);
    res.status(201).json({ success: true, data: created, message: "Su tipo de trabajo fue registrado con exito" });
  } catch (err: any) {
    const msg = String(err?.message || "Error");
    const isClientError = /existe|invalidas?|vacio|Minimo|Maximo|Solo|palabras|descripcion/i.test(msg);
    res.status(isClientError ? 400 : 500).json({ success: false, message: msg });
  }
});

export default router;
