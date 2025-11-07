import { Request, Response } from "express";
import  ClienteModel  from "../models/cliente.model";

// Obtener cliente por ID
export const obtenerClientePorIdController = async (req: Request, res: Response) => {
    try {
      const cliente = await ClienteModel.findById(req.params.id);
      if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
  
      res.json(cliente);
    } catch (error: any) {
      res.status(500).json({ message: "Error al obtener cliente", error: error.message });
    }
  };

/*  Crear cliente
export const crearClienteController = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ message: "Nombre es obligatorio" });

    const cliente = new ClienteModel({ nombre });
    await cliente.save();

    res.status(201).json(cliente);
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear cliente", error: error.message });
  }
};
*/
// Obtener todos los clientes
export const obtenerClientesController = async (_req: Request, res: Response) => {
  try {
    const clientes = await ClienteModel.find();
    res.json(clientes);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener clientes", error: error.message });
  }
};

