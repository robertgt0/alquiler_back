import { Request, Response } from "express";
import {crearTrabajo,obtenerTrabajos, obtenerTrabajoPorId, eliminarTrabajo} from "../services/trabajo.service";
import { DetallesTrabajo } from "../services/cancelar-trabajo.service";
// Crear nuevo trabajo
export const crearTrabajoController = async (req: Request, res: Response) => {
  try {
    const trabajo = await crearTrabajo(req.body);
    res.status(201).json(trabajo);
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear trabajo", error: error.message });
  }
};

// Obtener todos los trabajos
export const obtenerTrabajosController = async (req: Request, res: Response) => {
  try {
    const trabajos = await obtenerTrabajos();
    res.json(trabajos);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener trabajos", error: error.message });
  }
};

// Obtener trabajo por ID
export const obtenerTrabajoPorIdController = async (req: Request, res: Response) => {
  try {
    const trabajo = await obtenerTrabajoPorId(req.params.id);
    if (!trabajo) return res.status(404).json({ message: "Trabajo no encontrado" });
    res.json(trabajo);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener trabajo", error: error.message });
  }
};

// Eliminar trabajo
export const eliminarTrabajoController = async (req: Request, res: Response) => {
  try {
    const trabajoEliminado = await eliminarTrabajo(req.params.id);
    if (!trabajoEliminado) return res.status(404).json({ message: "Trabajo no encontrado" });
    res.json({ message: "Trabajo eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar trabajo", error: error.message });
  }
};

  //controllers para la HU2 y hu3 del segundo sprint
  export const obtenerTrabajoProveedorController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await DetallesTrabajo.obtenerTrabajoProveedor(id);

    if ("mensaje" in resultado) {
      return res.status(404).json({ message: resultado.mensaje });
    }

    res.status(200).json(resultado);
  } catch (error: any) {
    console.error("Error al obtener detalles del trabajo:", error.message);
    res.status(500).json({
      message: "Error al obtener detalles del trabajo",
      error: error.message,
    });
  }
};