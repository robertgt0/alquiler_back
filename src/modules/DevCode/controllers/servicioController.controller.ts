import { Request, Response } from "express";
import * as servicioService from "../services/servicioService.service";

export const createServicio = async (req: Request, res: Response) => {
  try {
    const servicio = await servicioService.createServicio(req.body);
    res.status(201).json({ success: true, data: servicio });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getServicios = async (_req: Request, res: Response) => {
  try {
    const servicios = await servicioService.getServicios();
    res.status(200).json({ success: true, data: servicios });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getServicioById = async (req: Request, res: Response) => {
  try {
    const servicio = await servicioService.getServicioById(req.params.id);
    if (!servicio) return res.status(404).json({ success: false, message: "Servicio no encontrado" });
    res.status(200).json({ success: true, data: servicio });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateServicio = async (req: Request, res: Response) => {
  try {
    const servicio = await servicioService.updateServicio(req.params.id, req.body);
    if (!servicio) return res.status(404).json({ success: false, message: "Servicio no encontrado" });
    res.status(200).json({ success: true, message: "Servicio actualizado correctamente", data: servicio });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteServicio = async (req: Request, res: Response) => {
  try {
    const servicio = await servicioService.deleteServicio(req.params.id);
    if (!servicio) return res.status(404).json({ success: false, message: "Servicio no encontrado" });
    res.status(200).json({ success: true, message: "Servicio eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
