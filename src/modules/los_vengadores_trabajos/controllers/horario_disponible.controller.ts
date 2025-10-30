import { Request, Response } from "express";
import HorarioModel, { IHorario } from "../models/horario_disponible.model";
import "../models/proveedor.model";
// GET /api/los_vengadores/horarios/:fecha
export const getHorariosPorFecha = async (req: Request, res: Response) => {
  try {
    const { fecha } = req.params;

    // Buscamos todos los horarios con esa fecha
    const horarios = await HorarioModel.find({ fecha })
      .populate({ path: "proveedorId", select: "nombre" }) // Poblamos solo el nombre del proveedor
      .sort({ horaInicio: 1 });

    res.json({
      success: true,
      data: horarios, // puede ser array vacío si no hay horarios
      count: horarios.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error al obtener horarios",
      error: err instanceof Error ? err.message : err
    });
  }
};

// ✅ POST /api/los_vengadores/horarios
export const crearHorario = async (req: Request, res: Response) => {
  try {
    const { proveedorId, fecha, horaInicio, horaFin } = req.body;

    if (!proveedorId || !fecha || !horaInicio || !horaFin) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos (proveedorId, fecha, horaInicio, horaFin son requeridos)"
      });
    }

    const nuevoHorario = new HorarioModel({
      proveedorId,
      fecha,
      horaInicio,
      horaFin
    });

    await nuevoHorario.save();

    res.status(201).json({ success: true, data: nuevoHorario });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error al crear horario",
      error: err
    });
  }
};

// ✅ DELETE /api/los_vengadores/horarios/:id
export const eliminarHorario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const eliminado = await HorarioModel.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ success: false, message: "Horario no encontrado" });
    }

    res.json({ success: true, message: "Horario eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al eliminar horario" });
  }
};

// ✅ PUT /api/los_vengadores/horarios/:id
export const actualizarHorario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { horaInicio, horaFin, fecha } = req.body;

  try {
    const actualizado = await HorarioModel.findByIdAndUpdate(
      id,
      { horaInicio, horaFin, fecha },
      { new: true } // Devuelve el documento actualizado
    );

    if (!actualizado) {
      return res.status(404).json({ success: false, message: "Horario no encontrado" });
    }

    res.json({ success: true, data: actualizado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al actualizar horario" });
  }
};
