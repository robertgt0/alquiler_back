import { Request, Response } from "express";
import { DisponibilidadService } from "../services/calendario-disponibilidad.service";

export class DisponibilidadController {
  static async obtenerHorariosDia(req: Request, res: Response) {
    const proveedorId = req.params.proveedorId; // extrae id del path
    const fecha = req.params.fecha;

    try {
      const result = await DisponibilidadService.obtenerHorariosDia(proveedorId, fecha);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async obtenerInfoProveedor(req: Request, res: Response) {
    const proveedorId = req.params.proveedorId;

    try {
      const result = await DisponibilidadService.obtenerInfoProveedor(proveedorId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}