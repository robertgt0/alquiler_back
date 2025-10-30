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
  static async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const citaActualizada = await CitaService.actualizarCita(id, data);

      if (!citaActualizada) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      res.json(citaActualizada);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const eliminada = await CitaService.eliminarCita(id);

      if (!eliminada) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      res.json({ message: 'Cita eliminada correctamente' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}