import { Request, Response } from "express";
import Trabajo from "../models/trabajo.model";
import Cliente from "../models/cliente.model";
import Proveedor from "../models/proveedor.model";

// Obtener un trabajo cancelado por su ID con nombres de cliente y proveedor
export const getTrabajoCanceladoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trabajo = await Trabajo.findById(id)
      .lean(); // convierte a objeto JS plano (mejor rendimiento)

    if (!trabajo) {
      return res.status(404).json({
        success: false,
        message: "Trabajo no encontrado",
      });
    }

    // Buscar nombres del cliente y proveedor
    const [cliente, proveedor] = await Promise.all([
      Cliente.findById(trabajo.id_cliente).select("nombre").lean(),
      Proveedor.findById(trabajo.id_proveedor).select("nombre").lean(),
    ]);

    // Agregar nombres al objeto de trabajo
    const trabajoConNombres = {
      ...trabajo,
      cliente_nombre: cliente?.nombre || "Cliente desconocido",
      proveedor_nombre: proveedor?.nombre || "Proveedor desconocido",
    };

    return res.json(trabajoConNombres);
  } catch (error: any) {
    console.error("Error al obtener trabajo cancelado:", error);
    return res.status(500).json({
      success: false,
      message: "Error del servidor al obtener el trabajo cancelado",
      error: error.message,
    });
  }
};
