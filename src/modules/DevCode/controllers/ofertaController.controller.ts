import { Request, Response } from "express";
import * as ofertaService from "../services/ofertaService.service";

export const createOferta = async (req: Request, res: Response) => {
  try {
    const oferta = await ofertaService.createOferta(req.body);
    res.status(201).json({ success: true, data: oferta });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getOfertas = async (_req: Request, res: Response) => {
  try {
    const ofertas = await ofertaService.getOfertas();
    res.status(200).json({ success: true, data: ofertas });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getOfertaById = async (req: Request, res: Response) => {
  try {
    const oferta = await ofertaService.getOfertaById(req.params.id);
    if (!oferta) return res.status(404).json({ success: false, message: "Oferta no encontrada" });
    res.status(200).json({ success: true, data: oferta });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateOferta = async (req: Request, res: Response) => {
  try {
    const oferta = await ofertaService.updateOferta(req.params.id, req.body);
    if (!oferta) return res.status(404).json({ success: false, message: "Oferta no encontrada" });
    res.status(200).json({ success: true, message: "Oferta actualizada correctamente", data: oferta });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteOferta = async (req: Request, res: Response) => {
  try {
    const oferta = await ofertaService.deleteOferta(req.params.id);
    if (!oferta) return res.status(404).json({ success: false, message: "Oferta no encontrada" });
    res.status(200).json({ success: true, message: "Oferta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
