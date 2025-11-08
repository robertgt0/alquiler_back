import { Request, Response } from 'express';
import { ServicioService } from '../services/servicio.service';

export class ServicioController {
  static async crear(req: Request, res: Response) {
    try {
      const servicio = await ServicioService.crear(req.body);
      res.status(201).json({ success: true, message: 'Servicio creado', data: servicio });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async listar(req: Request, res: Response) {
    try {
      const servicios = await ServicioService.listar();
      res.json({ success: true, data: servicios });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async listarPorProveedor(req: Request, res: Response) {
    try {
      const servicios = await ServicioService.listarPorProveedor(req.params.proveedorId);
      res.json({ success: true, data: servicios });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async obtener(req: Request, res: Response) {
    try {
      const servicio = await ServicioService.obtener(req.params.id);
      if (!servicio) return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
      res.json({ success: true, data: servicio });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const servicio = await ServicioService.actualizar(req.params.id, req.body);
      if (!servicio) return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
      res.json({ success: true, message: 'Servicio actualizado', data: servicio });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const eliminado = await ServicioService.eliminar(req.params.id);
      if (!eliminado) return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
      res.json({ success: true, message: 'Servicio eliminado correctamente' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
