import { Request, Response } from "express";
import * as clienteService from "@modules/DevCode/services/clienteServise.service";

export const createCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await clienteService.createCliente(req.body);
    res.status(201).json({ success: true, data: cliente });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getClientes = async (_req: Request, res: Response) => {
  try {
    const clientes = await clienteService.getClientes();
    res.status(200).json({ success: true, data: clientes });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getClienteById = async (req: Request, res: Response) => {
  try {
    const cliente = await clienteService.getClienteById(req.params.id);
    if (!cliente) return res.status(404).json({ success: false, message: "Cliente no encontrado" });
    res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await clienteService.updateCliente(req.params.id, req.body);
    if (!cliente) return res.status(404).json({ success: false, message: "Cliente no encontrado" });
    res.status(200).json({ success: true, message: "Cliente actualizado correctamente", data: cliente });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await clienteService.deleteCliente(req.params.id);
    if (!cliente) return res.status(404).json({ success: false, message: "Cliente no encontrado" });
    res.status(200).json({ success: true, message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
