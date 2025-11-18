import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { NotificacionWhatsApp } from "../models/notificacionWhatsApp.model";

export class NotificacionWhatsAppController extends BaseController {
  constructor() {
    super(NotificacionWhatsApp);
  }

  // Obtener notificaciones por estado
  async findByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const notificaciones = await this.model.find({ status });
      res.json(notificaciones);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar por transactionId
  async findByTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { transactionId } = req.params;
      const notificacion = await this.model.findOne({ transactionId });
      if (!notificacion) {
        res.status(404).json({ message: "Notificación no encontrada" });
        return;
      }
      res.json(notificacion);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const notificacionWhatsAppController = new NotificacionWhatsAppController();
