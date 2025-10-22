import { Request, Response } from "express";
import * as OfertaService from "../services/ofertas.service";

export const crearOfertaConImagen = async (req: Request, res: Response) => {
  try {
    const { descripcion, categoria } = req.body;
    const imagen = req.file?.buffer; // multer guarda en memoria

    const nuevaOferta = await OfertaService.crearOferta({
      descripcion,
      categoria,
      imagen,
    });

    res.status(201).json(nuevaOferta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la oferta", error });
  }
};

export const listarOfertas = async (_req: Request, res: Response) => {
  try {
    const ofertas = await OfertaService.obtenerOfertas();
    res.status(200).json(ofertas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las ofertas", error });
  }
};

// 🔹 Borrar oferta por ID
export const borrarOferta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eliminado = await OfertaService.eliminarOferta(id);
    if (!eliminado) return res.status(404).json({ message: "Oferta no encontrada" });
    res.status(200).json({ message: "Oferta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la oferta", error });
  }
};

// 🔹 Editar oferta por ID
export const editarOferta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { descripcion, categoria } = req.body;
    const imagen = req.file?.buffer;

    const ofertaEditada = await OfertaService.actualizarOferta(id, {
      descripcion,
      categoria,
      imagen,
    });

    if (!ofertaEditada) return res.status(404).json({ message: "Oferta no encontrada" });

    res.status(200).json(ofertaEditada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al editar la oferta", error });
  }
};
