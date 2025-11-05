import { Request, Response } from "express";
import { ClienteService } from "../services/cliente.service";

export class ClienteController {
  static async crear(req: Request, res: Response) {
    try {
      const nuevo = await ClienteService.crearCliente(req.body);
      res.status(201).json(nuevo);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async listar(req: Request, res: Response) {
    try {
      const clientes = await ClienteService.listarClientes();
      res.json(clientes);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async obtener(req: Request, res: Response) {
    try {
      const cliente = await ClienteService.obtenerCliente(req.params.id);
      if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
      res.json(cliente);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const actualizado = await ClienteService.actualizarCliente(req.params.id, req.body);
      if (!actualizado) return res.status(404).json({ error: "Cliente no encontrado" });
      res.json(actualizado);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const eliminado = await ClienteService.eliminarCliente(req.params.id);
      if (!eliminado) return res.status(404).json({ error: "Cliente no encontrado" });
      res.json({ mensaje: "Cliente eliminado" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
