// src/modules/los_vengadores_trabajos/controllers/horario.controller.ts
import { Request, Response } from "express";
import HorarioModel, { IHorario } from "../models/horario.model";

// GET /api/los_vengadores/horarios/:fecha
export const getHorariosPorFecha = async (req: Request, res: Response) => {
  try {
    const fecha = req.params.fecha;// as string;//req.params.fecha;
    console.log("🕓 Fecha recibida:", fecha);// imprime la fecha recibida
    const horarios: IHorario[] = await HorarioModel.find({ fecha }).sort({ horaInicio: 1 });
    res.json({ success: true, data: horarios });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al obtener horarios", error: err });
  }
};

// POST /api/los_vengadores/horarios
export const crearHorario = async (req: Request, res: Response) => {
  try {
    const { fecha, horaInicio, horaFin, costo } = req.body;

    if (!fecha || !horaInicio || !horaFin || !costo) {
      return res.status(400).json({ success: false, message: "Datos incompletos" });
    }

    const nuevoHorario = new HorarioModel({ fecha, horaInicio, horaFin, costo });
    await nuevoHorario.save();

    res.status(201).json({ success: true, data: nuevoHorario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al crear horario", error: err });
  }
};
// GET /api/los_vengadores/horarios/id
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
// GET /api/los_vengadores/horarios/id
export const actualizarHorario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { horaInicio, horaFin, costo } = req.body;

  try {
    const actualizado = await HorarioModel.findByIdAndUpdate(
      id,
      { horaInicio, horaFin, costo },
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
