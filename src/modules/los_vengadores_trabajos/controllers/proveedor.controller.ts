import { Request, Response } from "express";
import  ProveedorModel  from "../models/proveedor.model";

// Obtener proveedor por ID con servicios poblados
export const obtenerProveedorPorIdController = async (req: Request, res: Response) => {
    try {
      const proveedor = await ProveedorModel.findById(req.params.id).populate("servicios");
      if (!proveedor) return res.status(404).json({ message: "Proveedor no encontrado" });
  
      res.json(proveedor);
    } catch (error: any) {
      res.status(500).json({ message: "Error al obtener proveedor", error: error.message });
    }

/* Crear proveedor
export const crearProveedorController = async (req: Request, res: Response) => {
  try {
    const { nombre, servicios } = req.body;
    if (!nombre) return res.status(400).json({ message: "Nombre es obligatorio" });

    // servicios es un array de ObjectId de servicios existentes
    const proveedor = new ProveedorModel({ nombre, servicios: servicios || [] });
    await proveedor.save();

    res.status(201).json(proveedor);
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear proveedor", error: error.message });
  }*/
};

// Obtener todos los proveedores con servicios poblados
export const obtenerProveedoresController = async (_req: Request, res: Response) => {
  try {
    const proveedores = await ProveedorModel.find().populate("servicios");
    res.json(proveedores);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener proveedores", error: error.message });
  }
};
