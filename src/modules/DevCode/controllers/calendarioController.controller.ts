import { Request, Response } from "express";
import * as calendarioService from "../services/calendarioService.service";

export const createCalendario = async (req: Request, res: Response) => {
  try {
    const calendario = await calendarioService.createCalendario(req.body);
    res.status(201).json({ success: true, data: calendario });
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
