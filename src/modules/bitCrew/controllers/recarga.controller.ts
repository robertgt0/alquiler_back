import { Request, Response } from 'express';
import * as recargaService from '../services/recarga.service';

// --- Crear una nueva recarga ---
export const crearRecarga = async (req: Request, res: Response) => {
  try {
    const { nombre, detalle, monto, correo, telefono, tipoDocumento, numeroDocumento } = req.body;

    // Validación básica
    if (!nombre || !detalle || !monto || !correo || !telefono || !tipoDocumento || !numeroDocumento) {
      return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
    }

    // Crear nueva recarga
    const nuevaRecarga = await recargaService.crearRecarga({
      nombre,
      detalle,
      monto,
      correo,
      telefono,
      tipoDocumento,
      numeroDocumento,
    } as any);

    return res.status(201).json({
      success: true,
      message: "Recarga registrada correctamente",
      data: nuevaRecarga,
    });
  } catch (error: any) {
    console.error("Error en crearRecarga:", error.message);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// --- Obtener todas las recargas ---
export const obtenerRecargas = async (req: Request, res: Response) => {
  try {
    const recargas = await recargaService.obtenerRecargas();
    return res.status(200).json({
      success: true,
      message: "Lista de recargas obtenida correctamente",
      data: recargas,
    });
  } catch (error: any) {
    console.error("Error en obtenerRecargas:", error.message);
    return res.status(500).json({ success: false, message: "Error al obtener recargas" });
  }
};

