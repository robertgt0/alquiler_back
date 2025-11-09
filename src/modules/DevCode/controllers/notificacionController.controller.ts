import { Request, Response } from "express";
import * as notificacionService from "../services/notificacionService.service";

export const createNotificacion = async (req: Request, res: Response) => {
  try {
    const notificacion = await notificacionService.createNotificacion(req.body);
    res.status(201).json({ success: true, data: notificacion });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getNotificaciones = async (_req: Request, res: Response) => {
  try {
    const notificaciones = await notificacionService.getNotificaciones();
    res.status(200).json({ success: true, data: notificaciones });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getNotificacionById = async (req: Request, res: Response) => {
  try {
    const notificacion = await notificacionService.getNotificacionById(req.params.id);
    if (!notificacion) return res.status(404).json({ success: false, message: "Notificación no encontrada" });
    res.status(200).json({ success: true, data: notificacion });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateNotificacion = async (req: Request, res: Response) => {
  try {
    const notificacion = await notificacionService.updateNotificacion(req.params.id, req.body);
    if (!notificacion) return res.status(404).json({ success: false, message: "Notificación no encontrada" });
    res.status(200).json({ success: true, message: "Notificación actualizada correctamente", data: notificacion });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteNotificacion = async (req: Request, res: Response) => {
  try {
    const notificacion = await notificacionService.deleteNotificacion(req.params.id);
    if (!notificacion) return res.status(404).json({ success: false, message: "Notificación no encontrada" });
    res.status(200).json({ success: true, message: "Notificación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
