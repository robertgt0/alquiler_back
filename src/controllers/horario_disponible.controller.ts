import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { HorarioDisponible } from "../models/horario_disponible.model";

export class HorarioDisponibleController extends BaseController {
  constructor() {
    super(HorarioDisponible);
  }

  // Buscar horarios por proveedor
  async findByProveedor(req: Request, res: Response): Promise<void> {
    try {
      const { proveedorId } = req.params;
      const horarios = await this.model.find({ proveedorId });
      res.json(horarios);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar horarios por fecha
  async findByFecha(req: Request, res: Response): Promise<void> {
    try {
      const { fecha } = req.query;
      if (!fecha) {
        res.status(400).json({ error: "Debe proporcionar una fecha" });
        return;
      }

      const horarios = await this.model.find({ fecha });
      res.json(horarios);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Verificar disponibilidad dentro de un rango horario
  async verificarDisponibilidad(req: Request, res: Response): Promise<void> {
    try {
      const { proveedorId, fecha, horaInicio, horaFin } = req.body;

      if (!proveedorId || !fecha || !horaInicio || !horaFin) {
        res.status(400).json({ error: "Faltan datos obligatorios" });
        return;
      }

      const existe = await this.model.findOne({
        proveedorId,
        fecha,
        $or: [
          { horaInicio: { $lt: horaFin }, horaFin: { $gt: horaInicio } }
        ],
      });

      res.json({ disponible: !existe });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const horarioDisponibleController = new HorarioDisponibleController();
