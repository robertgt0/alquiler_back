import { Router } from "express";
import Recarga from "../../../models/recarga.model";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { nombre, detalle, monto, correo, telefono, tipoDocumento, numeroDocumento } = req.body;

    if (!nombre || !detalle || !monto || !correo || !telefono || !tipoDocumento || !numeroDocumento) {
      return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
    }

    const nuevaRecarga = new Recarga({ nombre, detalle, monto, correo, telefono, tipoDocumento, numeroDocumento });
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
