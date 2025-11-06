import { Request, Response } from 'express';
import { CitaService } from '../services/cita.service';

export class CitaController {
  static async crear(req: Request, res: Response) {
    try {
      const nueva = await CitaService.crearCita(req.body);
      res.status(201).json({ success: true, data: nueva });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listarPorProveedor(req: Request, res: Response) {
    try {
      const proveedorId = req.params.proveedorId;
      const citas = await CitaService.listarPorProveedor(proveedorId);
      res.json({ success: true, data: citas });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async listarPorCliente(req: Request, res: Response) {
    try {
      const clienteId = req.params.clienteId;
      const citas = await CitaService.listarPorCliente(clienteId);
      res.json({ success: true, data: citas });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const citaActualizada = await CitaService.actualizarCita(id, data);

      if (!citaActualizada) {
        return res.status(404).json({ success: false, error: 'Cita no encontrada' });
      }

      res.json({ success: true, data: citaActualizada });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // ✅ Eliminar cita como proveedor
  static async eliminarPorProveedor(req: Request, res: Response) {
    try {
      const { id } = req.params; // id de la cita
      const { proveedorId } = req.body; // proveedor que hace la petición

      await CitaService.eliminarCitaPorProveedor(id, proveedorId);

      res.json({ success: true, message: 'Cita eliminada correctamente' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
