import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Historial } from "../models/historial.model";

export class HistorialController extends BaseController {
  constructor() {
    super(Historial);
  }

  // Buscar historial por usuario
  async findByUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id_usuario } = req.params;
      const historial = await this.model.find({ id_usuario }).sort({ fecha: -1 });
      res.json(historial);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const historialController = new HistorialController();
