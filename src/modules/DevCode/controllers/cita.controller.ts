import { Request, Response } from 'express';
import { CitaService } from '../services/cita.service';

export class CitaController {
  static async crear(req: Request, res: Response) {
    try {
      const nueva = await CitaService.crearCita(req.body);
      res.status(201).json(nueva);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async listarPorProveedor(req: Request, res: Response) {
    try {
      const citas = await CitaService.listarPorProveedor(req.params.proveedorId);
      res.json(citas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async listarPorCliente(req: Request, res: Response) {
    try {
      const citas = await CitaService.listarPorCliente(req.params.clienteId);
      res.json(citas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
