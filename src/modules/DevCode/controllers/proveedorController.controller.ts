import { Request, Response } from "express";
import * as proveedorService from "../services/proveedorServirce.service";

export const createProveedor = async (req: Request, res: Response) => {
  try {
    const proveedor = await proveedorService.createProveedor(req.body);
    res.status(201).json({ success: true, data: proveedor });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getProveedores = async (_req: Request, res: Response) => {
  try {
    const proveedores = await proveedorService.getProveedores();
    res.status(200).json({ success: true, data: proveedores });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getProveedorById = async (req: Request, res: Response) => {
  try {
    const proveedor = await proveedorService.getProveedorById(req.params.id);
    if (!proveedor) return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
    res.status(200).json({ success: true, data: proveedor });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateProveedor = async (req: Request, res: Response) => {
  try {
    const proveedor = await proveedorService.updateProveedor(req.params.id, req.body);
    if (!proveedor) return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
    res.status(200).json({ success: true, message: "Proveedor actualizado correctamente", data: proveedor });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteProveedor = async (req: Request, res: Response) => {
  try {
    const proveedor = await proveedorService.deleteProveedor(req.params.id);
    if (!proveedor) return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
    res.status(200).json({ success: true, message: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
