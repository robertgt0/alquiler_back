import { Request, Response, NextFunction } from "express";
import AppointmentModel from "../../../models/appointment.model";
import { Types } from "mongoose";

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      cliente,
      proveedor,
      fecha,
      horaInicio,
      horaFin,
      duracionMinutos,
      ubicacion,
      notas,
      estado = "pendiente",
    } = req.body;

    if (!cliente || !proveedor || !fecha || !horaInicio || !horaFin || !duracionMinutos) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    if (!Types.ObjectId.isValid(cliente) || !Types.ObjectId.isValid(proveedor)) {
      return res.status(400).json({ message: "IDs inválidos" });
    }

    const ini = new Date(horaInicio);
    const fin = new Date(horaFin);
    if (!(ini < fin)) return res.status(400).json({ message: "Rango horario inválido" });

    const overlap = await AppointmentModel.findOne({
      proveedor: new Types.ObjectId(proveedor),
      estado: { $in: ["pendiente", "confirmada"] },
      $or: [{ horaInicio: { $lt: fin }, horaFin: { $gt: ini } }],
    }).select("_id");

    if (overlap) return res.status(409).json({ message: "El proveedor ya tiene una cita en ese horario" });

    const doc = await AppointmentModel.create({
      cliente,
      proveedor,
      fecha: new Date(`${fecha}T00:00:00.000Z`),
      horaInicio: ini,
      horaFin: fin,
      duracionMinutos,
      ubicacion,
      notas,
      estado,
    });

    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
