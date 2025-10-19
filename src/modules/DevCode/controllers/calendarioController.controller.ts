import { Request, Response } from "express";
import * as calendarioService from "../services/calendarioService.service";
import * as appointmentService from "../services/appointmentService.service";
import { Types } from 'mongoose';

export const createCalendario = async (req: Request, res: Response) => {
        const { 
        cliente, 
        proveedor, 
        horaInicio, 
        horaFin, 
        duracionMinutos, 
        ubicacion, 
        notas 
    } = req.body;

    if (!ubicacion || typeof ubicacion !== 'string' || ubicacion.trim() === '') {
              return res.status(400).json({ 
            success: false, 
            message: "La ubicación es un campo obligatorio y no puede estar vacío." 
        });
    }
    
    if (!Types.ObjectId.isValid(cliente) || !Types.ObjectId.isValid(proveedor)) {
        return res.status(400).json({ success: false, message: "IDs de Cliente o Proveedor inválidos" });
    }

    try {
        // Llama a la nueva función del servicio que maneja la creación de la CITA y el bloqueo del CALENDARIO
        const nuevaCita = await appointmentService.createAppointmentAndBlockTime(req.body);
        res.status(201).json({ success: true, data: nuevaCita });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// función de Controller para Disponibilidad
export const getAvailability = async (req: Request, res: Response) => {
    try {
        const { proveedorId, fecha } = req.query;

        if (!proveedorId || !fecha) {
             return res.status(400).json({ success: false, message: "proveedorId y fecha son requeridos." });
        }

        const disponibilidad = await appointmentService.checkProviderAvailability({ 
            proveedorId: proveedorId as string, 
            fecha: fecha as string 
        });

        res.status(200).json({ success: true, data: disponibilidad });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getCalendarios = async (_req: Request, res: Response) => {
  try {
    const calendarios = await calendarioService.getCalendarios();
    res.status(200).json({ success: true, data: calendarios });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getCalendarioById = async (req: Request, res: Response) => {
  try {
    const calendario = await calendarioService.getCalendarioById(req.params.id);
    if (!calendario) return res.status(404).json({ success: false, message: "Calendario no encontrado" });
    res.status(200).json({ success: true, data: calendario });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateCalendario = async (req: Request, res: Response) => {
  try {
    const calendario = await calendarioService.updateCalendario(req.params.id, req.body);
    if (!calendario) return res.status(404).json({ success: false, message: "Calendario no encontrado" });
    res.status(200).json({ success: true, message: "Calendario actualizado correctamente", data: calendario });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteCalendario = async (req: Request, res: Response) => {
  try {
    const calendario = await calendarioService.deleteCalendario(req.params.id);
    if (!calendario) return res.status(404).json({ success: false, message: "Calendario no encontrado" });
    res.status(200).json({ success: true, message: "Calendario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
