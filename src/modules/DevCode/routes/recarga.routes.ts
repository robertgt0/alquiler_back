import { Router } from "express";
import Recarga from "../../../models/recarga.model";

const router = Router();

router.post("/recargar", async (req, res) => {
  try {
    const { nombre, detalle, monto } = req.body;

    if (!nombre || !detalle || !monto) {
      return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
    }

    const nuevaRecarga = new Recarga({ nombre, detalle, monto });
    await nuevaRecarga.save();

    res.status(201).json({
      success: true,
      message: "Recarga registrada correctamente",
      data: nuevaRecarga,
    });
  } catch (error) {
    console.error("Error al guardar recarga:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;
