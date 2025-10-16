import { Request, Response } from "express";
import * as OfertaService from "../services/ofertas.service";

export const crearOferta = async (req: Request, res: Response) => {
  try {
    const nuevaOferta = await OfertaService.crearOferta(req.body);
    res.status(201).json(nuevaOferta);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la oferta", error });
  }
};

export const listarOfertas = async (req: Request, res: Response) => {
  try {
    const ofertas = await OfertaService.obtenerOfertas();
    res.status(200).json(ofertas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ofertas", error });
  }
};
